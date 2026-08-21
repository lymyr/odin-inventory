import { Router } from "express";
import { 
    getInventory,
    addInventory,
    getFormDetails,
    updateInventory,
    getUpdateInventory,
    deleteInventory
} from "../controllers/inventoryController.js";

const inventoryRouter = Router()

inventoryRouter.get('/', getInventory)
inventoryRouter.get('/inventory/add', getFormDetails)
inventoryRouter.post('/inventory/add', addInventory)
inventoryRouter.get('/update/:id', getUpdateInventory)
inventoryRouter.post('/inventory/update', updateInventory)
inventoryRouter.post('/delete', deleteInventory)

export default inventoryRouter