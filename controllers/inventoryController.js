import { body, param, validationResult } from "express-validator";
import { 
    getItem,
    getItems, 
    getPeople, 
    getPerson, 
    getInventory as queryAll,
    addInventory as queryAdd,
    getInvMatch,
    updateInventory as queryUpdate,
    getInvMatchById
} from "../db/query.js"

const validateInventory = [
    body('quantity').trim()
        .notEmpty().withMessage('quantity field cannot be empty!')
        .isInt().withMessage('Quantity should be an integer')
        .isInt({allow_leading_zeroes: false}).withMessage('Quantity should not lead with 0s')
        .isInt({min: 1}).withMessage('Quantity should be greater than 0')
        .toInt(),
    body('item_id')
        .exists({values: 'falsy'}).withMessage('please select an item')
        .isInt().bail().toInt().custom(async id => {
            const item = await getItem(id)
            if (item.length == 0)
                throw new Error('item id not found')
        }),
    body('person_id')
        .exists({values: 'falsy'}).withMessage('please select an owner of the item')
        .isInt().bail().toInt().custom(async id => {
            const person = await getPerson(id)
            if (person.length == 0)
                throw new Error('person id not found')
        }),
]

const validateInventoryDoesntExist = () => body('item_id')
    .custom(async (value, {req, res}) => {
        const matchingInv = await getInvMatch(value, req.body.person_id)
        if (matchingInv.length > 0)
            throw new Error('Inventory already exists')
    })

const validateInventoryExists = () => body('inv_id')
    .isInt().bail().toInt().custom(async (id, {req, res}) => {
        const matchingInv = await getInvMatchById(id)
        if (matchingInv < 1)
            throw new Error("Inventory doesn't exist")
    })



export async function getInventory(req, res) {
    const inventory = await queryAll(); // todo: include DISTINCT per table
    res.render('index', {title: 'Inventory', type: 'Add', dataList: inventory})
}

export async function getFormDetails(req, res) {
    const [items, people] = await Promise.all([getItems(), getPeople()])
    res.render('invenForm', {title: 'Inventory', items: items, people: people})
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
        else
            res.send(errs.mapped())
    }
]

export async function getUpdateInventory(req, res) {
    const invMatch = await getInvMatchById(parseInt(req.params.id))
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

export const updateInventory = [
    validateInventoryExists(),
    validateInventory,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryUpdate(req.body.inv_id, req.body.item_id, req.body.quantity, req.body.person_id)
            res.redirect('/')
        }
        else
            res.send(errs.mapped())
    }
]