import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters.")
        .max(50, "Name cannot exceed 50 characters."),

    email: z
        .email("Invalid email address.")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Password must contain uppercase, lowercase and a number."
        ),

    careerGoal: z
        .string()
        .trim()
        .optional(),

    avatar: z
        .string()
        .url()
        .optional()
});

export const loginSchema = z.object({

    email: z
    .string()
    .trim()
    .email("Invalid email.")
    .transform(email => email.toLowerCase()),

    password: z
        .string()
        .min(1, "Password is required.")

});
export const updateProfileSchema = z.object({

    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters.")
        .max(50, "Full name cannot exceed 50 characters.")
        .optional(),

    careerGoal: z
        .string()
        .trim()
        .optional(),

    avatar: z
        .string()
        .url("Avatar must be a valid URL.")
        .optional()

});