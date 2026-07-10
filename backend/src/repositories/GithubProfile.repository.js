import GithubProfile from "../models/GithubProfile.model.js";

class GithubProfileRepository {

    /**
     * Create GitHub Profile
     */
    async createProfile(profileData) {
        return await GithubProfile.create(profileData);
    }

    /**
     * Find GitHub Profile by User
     */
    async findByUser(userId) {

        return await GithubProfile.findOne({
            user: userId,
            isDeleted: false,
        });

    }

    /**
     * Find GitHub Profile by Username
     */
    async findByUsername(username) {

        return await GithubProfile.findOne({
            username,
            isDeleted: false,
        });

    }

}

export default new GithubProfileRepository();
