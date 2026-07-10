import User from "../models/User.model.js";

class UserRepository {

    /**
     * Create User
     */
    async createUser(userData) {
        return await User.create(userData);
    }

    /**
     * Find User by Email
     */
    async findByEmail(email, includePassword = false) {

        const query = User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (includePassword) {
            query.select("+password");
        }

        return await query;

    }

    /**
     * Find User by ID
     */
    async findById(userId) {

        return await User.findById(userId);

    }

    /**
     * Update User
     */
    async updateUser(userId, updateData) {

        return await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

    }

    /**
     * Check Email Exists
     */
    async emailExists(email) {

        const user = await User.exists({
            email: email.toLowerCase().trim(),
        });

        return !!user;

    }

    /**
     * Update Last Login
     */
    async updateLastLogin(userId) {

        return await User.findByIdAndUpdate(
            userId,
            {
                lastLogin: new Date(),
            },
            {
                new: true,
            }
        );

    }

    /**
     * Deactivate User
     */
    async deactivateUser(userId) {

        return await User.findByIdAndUpdate(
            userId,
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

    }

    /**
     * Mark Profile Completed
     */
    async markProfileCompleted(userId) {

        return await User.findByIdAndUpdate(
            userId,
            {
                profileCompleted: true,
            },
            {
                new: true,
            }
        );

    }

}

export default new UserRepository();