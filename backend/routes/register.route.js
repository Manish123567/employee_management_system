import express from "express";
import { CandidateRegister } from "../controllers/register.controller.js";

const router = express.Router();

router.post("/register", CandidateRegister);

export default router;
