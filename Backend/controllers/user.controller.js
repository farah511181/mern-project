import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/Cloudinary.js";

export const register = async (req, res) => {
    try {
        console.log("✅ Register API hit hua");

        const { fullname, email, phoneNumber, password, role } = req.body;
        console.log("🟡 req.body:", req.body);
        if (!fullname || !email || !phoneNumber || !password || !role) {
            console.log("❌ Required fields missing in request");
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        console.log("🟡 req.file:", file);

        if (!file) {
            console.log("❌ File not provided");
            return res.status(400).json({
                message: "Profile picture is required",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        console.log("🟢 fileUri:", fileUri);

        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "auto",  // 🔥 IMPORTANT for PDFs
            folder: "resumes",     // (optional) for better structure
        });

        console.log("🟢 cloudinary upload success:", cloudResponse.secure_url);

        const user = await User.findOne({ email });
        if (user) {
            console.log("❌ User already exists");
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Password hashed successfully");

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePicture: cloudResponse.secure_url, // save cloudinary URL
            }
        });

        console.log("✅ New user created successfully");
        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });

    } catch (error) {
        console.log("🔥 Register API Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect email or password',
                success: false,
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect email or password',
                success: false,
            })
        };
        //check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: 'Incorrect email or password',
                success: false,
            })
        };
        const tokenData = {
            userId: user._id,
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: "Login successful",
            token,
            user,
            success: true,
        })
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "Welcome Back",
            success: true,
        });

    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, }).json({
            message: "Logout successful",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");
        const hash = crypto.createHash("sha256").update(token).digest("hex");

        user.resetPasswordToken = hash;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${token}`; // frontend URL
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        const mailOptions = {
            from: "noreply@example.com",
            to: email,
            subject: "Password Reset Request",
            html: `<p>You requested to reset your password. Click the link below to reset it:</p><a href="${resetUrl}">Reset Password</a>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: "Password reset email sent",
            success: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email", success: false });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token",
                success: false
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successful",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);

        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "auto",
            folder: "resumes",
            type: "upload"
        });

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
                success: false,
            });
        }

        // Update profile fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Resume upload fields
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
        });
    }
};
