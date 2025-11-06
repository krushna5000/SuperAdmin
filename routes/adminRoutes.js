import express from "express";
const router = express.Router();
import { 
  createAdmin, getAdmins, updateAdmin, deleteAdmin, superAdminLogin 
} from "../controllers/adminController.js";

import { superAdminAuth } from "../middlewares/auth.js";

router.post("/superadmin/login", superAdminLogin);
router.post("/admin", superAdminAuth, createAdmin);
router.get("/admin", superAdminAuth, getAdmins);
router.put("/admin/:id", superAdminAuth, updateAdmin);
router.delete("/admin/:id", superAdminAuth, deleteAdmin);

export default router;
