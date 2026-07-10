import userRepository from "../repositories/User.repository.js";
import ApiError from "../utils/ApiError.js";

import {
    hashPassword,
    comparePassword,
} from "../utils/password.js";

import {
    generateAccessToken,
} from "../utils/jwt.js";

class AuthService {

    /**
     * Remove sensitive fields before sending user to client
     */
    sanitizeUser(user) {

        return {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            careerGoal: user.careerGoal,
            role: user.role,
            provider: user.provider,
            isVerified: user.isVerified,
            isActive: user.isActive,
            profileCompleted: user.profileCompleted,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

    }

    /**
     * Register User
     */
    async register(userData) {

        const {
            fullName,
            email,
            password,
            careerGoal = "",
        } = userData;

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const emailExists =
            await userRepository.emailExists(
                normalizedEmail
            );

        if (emailExists) {

            throw new ApiError(
                409,
                "Email already exists."
            );

        }

        const hashedPassword =
            await hashPassword(password);
const user = await userRepository.createUser({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    careerGoal,
});
        const token =
            generateAccessToken({

                id: user._id,

                email: user.email,

                role: user.role,

            });

        return {

            user: this.sanitizeUser(user),

            token,

        };

    }
        /**
     * Login User
     */
    async login(email, password) {

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // Find user with password

        const user =
            await userRepository.findByEmail(
                normalizedEmail,
                true
            );

        if (!user) {

            throw new ApiError(
                401,
                "Invalid email or password."
            );

        }

        // Check account status

        if (!user.isActive) {

            throw new ApiError(
                403,
                "Your account has been deactivated."
            );

        }

        // Verify password

        const isPasswordCorrect =
            await comparePassword(
                password,
                user.password
            );

        if (!isPasswordCorrect) {

            throw new ApiError(
                401,
                "Invalid email or password."
            );

        }

        // Update last login

        await userRepository.updateLastLogin(
            user._id
        );

        // Fetch updated user

        const updatedUser =
            await userRepository.findById(
                user._id
            );

        // Generate JWT

        const token =
            generateAccessToken({

                id: updatedUser._id,

                email: updatedUser.email,

                role: updatedUser.role,

            });

        return {

            user: this.sanitizeUser(updatedUser),

            token,

        };

    }
        /**
     * Get Logged-in User Profile
     */
    async getProfile(userId) {

        const user =
            await userRepository.findById(userId);

        if (!user) {

            throw new ApiError(
                404,
                "User not found."
            );

        }

        return this.sanitizeUser(user);

    }

    /**
     * Update User Profile
     */
   /**
 * Update User Profile
 */
async updateProfile(userId, updateData) {

    // Never allow these fields to be updated
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.provider;
    delete updateData.isVerified;
    delete updateData.isActive;
    delete updateData.isDeleted;
    delete updateData.lastLogin;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.profileCompleted; // Prevent manual updates

    const updatedUser =
        await userRepository.updateUser(
            userId,
            updateData
        );

    if (!updatedUser) {

        throw new ApiError(
            404,
            "User not found."
        );

    }

    return this.sanitizeUser(updatedUser);

}

}

export default new AuthService();