import Job from "../models/job.model.js";

// ✅ Admin can create job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, location, salary, jobType, experience, position, companyId } = req.body;
        const userId = req.user._id;

        if (!title || !description || !requirements || !location || !salary || !jobType || !experience || !position) {
            return res.status(400).json({
                message: 'Please fill all the fields.',
                success: false,
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            location,
            salary: Number(salary),
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: 'Job created successfully.',
            job,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
// ✅ Get all jobs for students
export const getAllJob = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (jobs.length === 0) {
            return res.status(404).json({
                message: 'No jobs found.',
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            jobs,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// ✅ Student can apply/view job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
        })


        if (!job) {
            return res.status(404).json({
                message: 'No job found.',
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// ✅ Admin can get their posted jobs
export const getadminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: 'No jobs found.',
                success: false
            })
        };

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
