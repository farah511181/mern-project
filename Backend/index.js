import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import JobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import authRoutes from './routes/auth.route.js'
import path from "path";


dotenv.config({});

const app = express();
const _dirname = path.resolve();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT|| 3000;


//api's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", JobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/auth", authRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*',(_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT,()=>{
     connectDB();
    console.log(`Server running at port ${PORT}`);
})