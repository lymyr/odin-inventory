import { body } from "express-validator"
import { 
    getItem,
    getPerson, 
    getInvMatch,
    getInvMatchById,
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
        if (req.body.person_id != '') {
            let id = req.body.id
            if (req.body.id == '')
                id = null
            const matchingInv = await getInvMatch(value, req.body.person_id, id)
            if (matchingInv.length > 0)
                throw new Error('Inventory already exists')
        }
    })

const validateInventoryIdExists = () => body('id')
    .isInt().bail().toInt().custom(async (id) => {
        const matchingInv = await getInvMatchById(id)
        if (matchingInv < 1)
            throw new Error("Inventory doesn't exist")
    })


export {
    validateInventory, 
    validateInventoryIdExists, 
    validateInventoryDoesntExist
}