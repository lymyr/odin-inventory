import { body, param, validationResult } from "express-validator";
import { 
    getItems, 
    getPeople, 
    getInventory as queryAll,
    addInventory as queryAdd,
    updateInventory as queryUpdate,
    getInvMatchById,
    deleteInventory as queryDelete
} from "../db/query.js"

import { 
    validateInventory,
    validateInventoryDoesntExist,
    validateInventoryIdExists
 } from "../validations/inventoryValidation.js";
import { validateIdBody, validateIdParam } from "../validations/generalValidation.js";




export async function getInventory(req, res) {
    const inventory = await queryAll();
    res.render('index', {title: 'Inventory', dataList: inventory})
}

export async function getFormDetails(req, res) {
    const [items, people] = await Promise.all([getItems(), getPeople()])
    res.render('invenForm', {title: 'Inventory', type:'Add', items: items, people: people})
}

export const addInventory = [
    validateInventory,
    validateInventoryDoesntExist(),
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryAdd(req.body.item_id, req.body.quantity, req.body.person_id)
            res.redirect('/')
        }
        else {
            const [items, people] = await Promise.all([getItems(), getPeople()])
            res.status(400).render('invenForm', {
                title: 'Inventory',
                type: 'Add',
                invMatch: req.body,
                items: items,
                people: people,
                errors: errs.mapped()
            })
        }
    }
]

export const getUpdateInventory = [
    validateIdParam,
    async (req, res) => {
        const invMatch = await getInvMatchById(req.params.id)
        if (invMatch.length < 1)
            throw new Error('inventory not found')
        const [items, people] = await Promise.all([getItems(), getPeople()])
        res.render('invenForm', {
            title: 'Inventory', 
            type: 'Update', 
            invMatch: invMatch[0],
            items: items,
            people: people
        })
    }
]

export const updateInventory = [
    validateInventory,
    validateInventoryIdExists(),
    validateInventoryDoesntExist(),
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryUpdate(req.body.id, req.body.item_id, req.body.quantity, req.body.person_id)
            res.redirect('/')
        }
        else {
            const [items, people] = await Promise.all([getItems(), getPeople()])
            res.status(400).render('invenForm', {
                title: 'Inventory',
                type: 'Update',
                invMatch: req.body,
                items: items,
                people: people,
                errors: errs.mapped()
            })
        }
    }
]


export const deleteInventory = [
    validateIdBody,
    validateInventoryIdExists(),
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryDelete(req.body.id)
            return res.redirect('/')
        }
        else {
            const inventory = await queryAll();
            res.status(400).render('index', {title: 'Inventory', dataList: inventory, errors: errs.array()})
        }
    }
]