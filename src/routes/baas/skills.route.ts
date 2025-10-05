import Controller from "@controllers/index";
import Middleware from "@middlewares/index";
import { Router } from "express";

const clientSkillRoutes = Router();

clientSkillRoutes.get("/list", Middleware.checkIfClientAuthenticated, Controller.skills().clientList)

export default clientSkillRoutes;