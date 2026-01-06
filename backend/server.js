
import express from 'express';
import connectDB from "./config/db.js";
import cors from 'cors';
import mongoose from 'mongoose';
import employeeRoutes from './routes/addcandidate.route.js';
import loginRoutes from "./routes/login.route.js";
import RegisterRoutes from "./routes/register.route.js";

const app = express();

connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static('uploads'));

// Routes
app.use('/forms', employeeRoutes);
app.use("/api", loginRoutes);
app.use("/api", RegisterRoutes);



const PORT = process.env.PORT || 8009;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
