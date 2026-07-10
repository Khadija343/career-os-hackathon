import { verifyAccessToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/User.repository.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Access token is missing.");
        }

        const token = authHeader.replace("Bearer ", "").trim();

        const decoded = verifyAccessToken(token);

        const user = await userRepository.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "User not found.");
        }

        if (!user.isActive) {
            throw new ApiError(403, "User account is inactive.");
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }

        return next(
            new ApiError(401, "Invalid or expired access token.")
        );
    }
};

export default authMiddleware;