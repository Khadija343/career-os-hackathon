import githubProfileRepository from "../repositories/GithubProfile.repository.js";
import githubRepositoryRepository from "../repositories/GithubRepository.repository.js";
import ApiError from "../utils/ApiError.js";
import { fetchGithubUser, fetchGithubRepos } from "../helpers/githubApi.helper.js";
import { buildGithubAnalytics } from "../helpers/githubAnalytics.helper.js";

class GithubService {

    /**
     * Remove internal/sensitive fields before sending profile to client
     */
    sanitizeProfile(profile) {

        return {
            id: profile._id,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            profileUrl: profile.profileUrl,
            bio: profile.bio,
            publicRepos: profile.publicRepos,
            followers: profile.followers,
            following: profile.following,
            company: profile.company,
            location: profile.location,
            blog: profile.blog,
            githubCreatedAt: profile.githubCreatedAt,
            lastSyncedAt: profile.lastSyncedAt,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };

    }

    /**
     * Map GitHub's raw REST API user object onto our schema's fields.
     */
    mapGithubUserToProfile(githubUser) {

        return {
            username: githubUser.login,
            avatarUrl: githubUser.avatar_url || "",
            profileUrl: githubUser.html_url || "",
            bio: githubUser.bio || "",
            publicRepos: githubUser.public_repos || 0,
            followers: githubUser.followers || 0,
            following: githubUser.following || 0,
            company: githubUser.company || "",
            location: githubUser.location || "",
            blog: githubUser.blog || "",
            githubCreatedAt: githubUser.created_at ? new Date(githubUser.created_at) : null,
            lastSyncedAt: new Date(),
        };

    }

    /**
     * Connect GitHub Account
     *
     * Fetches the given username's public profile from the official
     * GitHub REST API and stores it against the logged-in user. A user
     * may only have one GitHub connection, and a given GitHub username
     * may only be linked to one Career OS account.
     */
    async connectGithub(userId, username) {

        const existingConnection = await githubProfileRepository.findByUser(userId);

        if (existingConnection) {

            throw new ApiError(
                409,
                "A GitHub account is already connected. Disconnect it before connecting a different one."
            );

        }

        const githubUser = await fetchGithubUser(username);

        const usernameAlreadyLinked = await githubProfileRepository.findByUsername(githubUser.login);

        if (usernameAlreadyLinked) {

            throw new ApiError(
                409,
                "This GitHub account is already connected to another user."
            );

        }

        try {

            const profile = await githubProfileRepository.createProfile({
                user: userId,
                ...this.mapGithubUserToProfile(githubUser),
            });

            return this.sanitizeProfile(profile);

        } catch (error) {

            // Guards against a race condition between the existence
            // checks above and the actual insert (duplicate key on
            // `user` or `username`'s unique indexes).
            if (error.code === 11000) {

                throw new ApiError(
                    409,
                    "This GitHub account is already connected."
                );

            }

            throw error;

        }

    }

    /**
     * Get Connected GitHub Profile for Logged-in User
     */
    async getProfile(userId) {

        const profile = await githubProfileRepository.findByUser(userId);

        if (!profile) {

            throw new ApiError(404, "No GitHub account connected yet.");

        }

        return this.sanitizeProfile(profile);

    }

    /**
     * Remove internal/sensitive fields before sending a repository to client
     */
    sanitizeRepository(repo) {

        return {
            id: repo._id,
            githubRepoId: repo.githubRepoId,
            name: repo.name,
            fullName: repo.fullName,
            description: repo.description,
            language: repo.language,
            topics: repo.topics,
            stars: repo.stars,
            forks: repo.forks,
            watchers: repo.watchers,
            defaultBranch: repo.defaultBranch,
            license: repo.license,
            homepage: repo.homepage,
            htmlUrl: repo.htmlUrl,
            isPrivate: repo.isPrivate,
            isFork: repo.isFork,
            isArchived: repo.isArchived,
            createdAtGithub: repo.createdAtGithub,
            updatedAtGithub: repo.updatedAtGithub,
            lastSyncedAt: repo.lastSyncedAt,
        };

    }

    /**
     * Map GitHub's raw REST API repo object onto our schema's fields.
     */
    mapGithubRepoToDocument(githubRepo, userId, githubProfileId) {

        return {
            user: userId,
            githubProfile: githubProfileId,
            githubRepoId: githubRepo.id,
            name: githubRepo.name,
            fullName: githubRepo.full_name,
            description: githubRepo.description || "",
            language: githubRepo.language || "",
            topics: Array.isArray(githubRepo.topics) ? githubRepo.topics : [],
            stars: githubRepo.stargazers_count || 0,
            forks: githubRepo.forks_count || 0,
            watchers: githubRepo.watchers_count || 0,
            defaultBranch: githubRepo.default_branch || "",
            license: githubRepo.license?.name || "",
            homepage: githubRepo.homepage || "",
            htmlUrl: githubRepo.html_url || "",
            isPrivate: Boolean(githubRepo.private),
            isFork: Boolean(githubRepo.fork),
            isArchived: Boolean(githubRepo.archived),
            createdAtGithub: githubRepo.created_at ? new Date(githubRepo.created_at) : null,
            updatedAtGithub: githubRepo.updated_at ? new Date(githubRepo.updated_at) : null,
            lastSyncedAt: new Date(),
        };

    }

    /**
     * Sync GitHub Repositories
     *
     * Fetches every public repository for the user's connected GitHub
     * account and upserts each one, keyed on GitHub's own repo id so
     * re-syncing never creates duplicates — it just refreshes stars,
     * forks, description, etc. on existing rows.
     */
    async syncRepositories(userId) {

        const profile = await githubProfileRepository.findByUser(userId);

        if (!profile) {

            throw new ApiError(
                404,
                "Connect a GitHub account before syncing repositories."
            );

        }

        const githubRepos = await fetchGithubRepos(profile.username);

        let inserted = 0;
        let updated = 0;

        for (const githubRepo of githubRepos) {

            const repoData = this.mapGithubRepoToDocument(githubRepo, userId, profile._id);

            const { wasInserted } = await githubRepositoryRepository.upsertByGithubRepoId(
                repoData.githubRepoId,
                repoData
            );

            if (wasInserted) {
                inserted += 1;
            } else {
                updated += 1;
            }

        }

        return {
            synced: githubRepos.length,
            inserted,
            updated,
        };

    }

    /**
     * Get Synced Repositories for Logged-in User
     *
     * Always reads from MongoDB — never calls the GitHub API directly —
     * so this stays fast and doesn't consume rate limit on every page load.
     */
    async getRepositories(userId) {

        const profile = await githubProfileRepository.findByUser(userId);

        if (!profile) {

            throw new ApiError(404, "No GitHub account connected yet.");

        }

        const repositories = await githubRepositoryRepository.findAllByUser(userId);

        return repositories.map((repo) => this.sanitizeRepository(repo));

    }

    /**
     * Get GitHub Analytics for Logged-in User
     *
     * Computed entirely from repositories already stored in MongoDB —
     * never calls the GitHub API. A connected profile with zero synced
     * repositories is a valid state and yields zeroed-out analytics
     * rather than an error.
     */
    async getGithubAnalytics(userId) {

        const profile = await githubProfileRepository.findByUser(userId);

        if (!profile) {

            throw new ApiError(404, "No GitHub account connected yet.");

        }

        const repositories = await githubRepositoryRepository.findAllByUser(userId);
        const plainRepos = repositories.map((repo) => repo.toObject());

        return buildGithubAnalytics(plainRepos);

    }

}

export default new GithubService();
