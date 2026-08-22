import { Router } from "express";
import { 
    getCategories,
    addCategory,
    getAddCategory,
    getUpdateCategory,
    updateCategory
} from "../controllers/categoryController.js";

const categoryRouter = Router()

categoryRouter.get('/', getCategories)
categoryRouter.get('/add', getAddCategory)
categoryRouter.post('/add', addCategory)
categoryRouter.get('/update/:id', getUpdateCategory)
categoryRouter.post('/update', updateCategory)
export default categoryRouter