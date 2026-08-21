import { body, validationResult } from "express-validator";
import { 
    getItem,
    getItems, 
    getPeople, 
    getPerson, 
    getInventory as queryAll,
    addInventory as queryAdd,
    getInvMatch
} from "../db/query.js"

const validateInventory = [
    body('quantity').trim()
        .notEmpty().withMessage('quantity field cannot be empty!')
        .isInt().withMessage('Quantity should be an integer')
        .isInt({allow_leading_zeroes: false}).withMessage('Quantity should not lead with 0s')
        .isInt({min: 1}).withMessage('Quantity should be greater than 0')
        .toInt(),
    body('item_id')
        .isInt().bail().toInt().custom(async id => {
            const item = await getItem(id)
            if (item.length == 0)
                throw new Error('item id not found')
        }),
    body('person_id')
        .isInt().bail().toInt().custom(async id => {
            const person = await getPerson(id)
            if (person.length == 0)
                throw new Error('person id not found')
        }),
    body('item_id')
        .custom(async (value, {req, res}) => {
            const matchingInv = await getInvMatch(value, req.body.person_id)
            if (matchingInv.length > 0)
                throw new Error('Inventory already exists')
        })
]


export async function getInventory(req, res) {
    const inventory = await queryAll(); // todo: include DISTINCT per table
    res.render('index', {title: 'Inventory', dataList: inventory})
}

export async function getFormDetails(req, res) {
    const [items, people] = await Promise.all([getItems(), getPeople()])
    res.render('invenForm', {title: 'Inventory', items: items, people: people})
}

export const addInventory = [
    validateInventory,
    async (req, res, next) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryAdd(req.body.item_id, req.body.quantity, req.body.person_id)
            res.redirect('/')
        }
        else
            res.send(errs.mapped())
    }
]