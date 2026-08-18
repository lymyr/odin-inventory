import { Router } from "express";
import { getPeople } from "../controllers/personController.js";

const personRouter = Router()

personRouter.get('/' ,getPeople)

export default personRouter