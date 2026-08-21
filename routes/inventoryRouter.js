import { Router } from "express";
import { 
    getInventory,
    addInventory
} from "../controllers/inventoryController.js";

const inventoryRouter = Router()

inventoryRouter.get('/', getInventory)
inventoryRouter.post('/', addInventory)

export default inventoryRouter