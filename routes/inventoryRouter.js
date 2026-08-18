import { Router } from "express";
import { 
    getInventory,
} from "../controllers/inventoryController.js";

const inventoryRouter = Router()

inventoryRouter.get('/', getInventory)

export default inventoryRouter