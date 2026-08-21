import { Router } from "express";
import { 
    getCategories,
    addCategory
} from "../controllers/categoryController.js";

const categoryRouter = Router()

categoryRouter.get('/', getCategories)
categoryRouter.post('/', addCategory)

export default categoryRouter