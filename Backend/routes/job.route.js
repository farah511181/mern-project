import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getadminJobs, getAllJob, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/get").get(getAllJob);

router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getadminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;
