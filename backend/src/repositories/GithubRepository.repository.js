import GithubRepository from "../models/GithubRepository.model.js";

class GithubRepositoryRepository {

    /**
     * Upsert One Repository by its GitHub Repo ID
     *
     * Creates the document if it doesn't exist yet, otherwise updates it
     * in place. Reports back whether it was an insert or an update so the
     * sync service can tally { synced, inserted, updated }.
     */
    async upsertByGithubRepoId(githubRepoId, repoData) {

        const rawResult = await GithubRepository.findOneAndUpdate(
            { githubRepoId },
            { $set: repoData },
            {
                upsert: true,
                returnDocument: "after",
                setDefaultsOnInsert: true,
                includeResultMetadata: true,
            }
        );

        return {
            document: rawResult.value,
            wasInserted: !rawResult.lastErrorObject?.updatedExisting,
        };

    }

    /**
     * Find All Repositories for a User
     */
    async findAllByUser(userId) {

        return await GithubRepository.find({
            user: userId,
            isDeleted: false,
        }).sort({ updatedAtGithub: -1 });

    }

}

export default new GithubRepositoryRepository();
