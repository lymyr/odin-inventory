import { Router } from "express";
import { 
    getItems,
    getAddItem,
    addItem,
    getUpdateItem,
    updateItem
 } from "../controllers/itemController.js";

const itemRouter = Router()

itemRouter.get('/', getItems)
itemRouter.get('/add', getAddItem)
itemRouter.post('/add', addItem)
itemRouter.get('/update/:id', getUpdateItem)
itemRouter.post('/update', updateItem)
// itemRouter.post('/delete', deleteItem)

export default itemRouter