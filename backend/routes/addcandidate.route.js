import express from "express";
const router = express.Router();

import {
  createForm,
  getAllForms,
  deleteEmployee,
  searchEmployee,
  updateEmployee,
  getdatabyName,

} from "../controllers/addcandidate.controller.js";
import upload from "../config/multer.Congif.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/", upload.single("image"), createForm);
router.get("/get", authMiddleware, getAllForms);
router.delete("/:id", authMiddleware, deleteEmployee);
router.get("/search", authMiddleware, searchEmployee);
router.put("/update/:id", upload.single("image"), updateEmployee);
router.get("/search/:name", authMiddleware, getdatabyName);



export default router;
