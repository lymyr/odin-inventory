import { Router } from "express";
import { 
    getPeople,
    getAddPerson,
    addPerson,
    getUpdatePerson,
    updatePerson,
    deletePerson
 } from "../controllers/personController.js";

const personRouter = Router()

personRouter.get('/' ,getPeople)
personRouter.get('/add', getAddPerson)
personRouter.post('/add', addPerson)
personRouter.get('/update/:id', getUpdatePerson)
personRouter.post('/delete', deletePerson)
personRouter.post('/update', updatePerson)

export default personRouter