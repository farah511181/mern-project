import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/Cloudinary.js";

// ✅ Register Company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if company already exists
        let existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "You cannot register the same company again.",
                success: false,
            });
        }

        // ✅ Get user ID from authenticated middleware
        const userId = req.user._id;

        // Create new company
        const company = await Company.create({
            name: companyName,
            userId: userId,
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true,
        });

    } catch (error) {
        console.error("Register Company Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ✅ Get all companies for logged-in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        const companies = await Company.find({ userId });

        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: 'No companies found.',
                success: false,
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("Get Company Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ✅ Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: 'No company found.',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Company found.',
            success: true,
            company
        });

    } catch (error) {
        console.error("Get Company By ID Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ✅ Update Company
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location } = req.body;

        let company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        // 🟡 If file is provided, upload it to Cloudinary
        if (req.file) {
            const fileUri = getDataUri(req.file); // ✅ safe call now
            const cloudRes = await cloudinary.uploader.upload(fileUri.content);

            company.logo = cloudRes.secure_url;
            company.logoPublicId = cloudRes.public_id;
        }

        // 🟡 Update other fields
        if (name) company.name = name;
        if (description) company.description = description;
        if (location) company.location = location;

        await company.save();

        return res.status(200).json({
            message: "Company updated successfully.",
            success: true,
            company,
        });
    } catch (error) {
        console.error("Update Company Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
