import { Router } from "express";
import { getItems } from "../controllers/itemController.js";

const itemRouter = Router()

itemRouter.get('/', getItems)

export default itemRouter