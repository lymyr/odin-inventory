import { Router } from "express";
import { 
    getInventory,
    addInventory,
    getFormDetails
} from "../controllers/inventoryController.js";

const inventoryRouter = Router()

inventoryRouter.get('/', getInventory)
inventoryRouter.post('/', addInventory)
inventoryRouter.get('/inventory/add', getFormDetails)
inventoryRouter.post('/inventory/add', addInventory)

export default inventoryRouter