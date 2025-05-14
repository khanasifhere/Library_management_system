import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { addBook,deleteBook,getAllBooks } from "../controllers/bookController.js";
import express from "express";
const router = express.Router();
router.post("/admin/add",isAuthenticated,isAuthorized("admin"),addBook);
router.delete("/delete/:id",isAuthenticated,isAuthorized("admin"),deleteBook);
router.get("/all",isAuthenticated,getAllBooks);
export default router;
