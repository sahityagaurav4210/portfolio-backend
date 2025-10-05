import Controller from "@controllers/index";
import Middleware from "@middlewares/index";
import { Router } from "express";

const skillRoutes = Router();

skillRoutes.post("/add", Middleware.skills().createNewSkillValidator, Middleware.checkIfAuthenticated, Controller.skills().create);
skillRoutes.get("/list", Middleware.checkIfAuthenticated, Controller.skills().list);
skillRoutes.put("/update/:skillId", Middleware.skills().createNewSkillValidator, Middleware.checkIfAuthenticated, Controller.skills().update);

export default skillRoutes;