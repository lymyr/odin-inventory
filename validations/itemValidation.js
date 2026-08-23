import { body } from "express-validator";
import generalValidation, { validateIdBody } from "./generalValidation.js";
import { getItemByName, getItemsFilterId, getItemsInInv } from "../db/query.js";

const santizeCategory = body('category').toArray()
    .customSanitizer(async (cats) => {
        return cats.map(catID => parseInt(catID))
})

export const itemValidation = [
    ...generalValidation,
    body('name').notEmpty().bail()
        .custom(async (name) => {
            const item = await getItemByName(name)
            if (item.length !== 0)
                throw new Error("Item already exists")
        }),
    santizeCategory
]

export const itemUpdateValidation = [
    ...generalValidation,
    validateIdBody,
    body('name').notEmpty().bail()
        .custom(async (name, {req, res}) => {
            const item = await getItemsFilterId(req.body.id, name)
            if (item.length > 0)
                throw new Error('Item already exists')
        }),
    santizeCategory
]


export const itemDeleteValidation = [
    validateIdBody,
    body('id').custom(async item_id => {
        const invItems = await getItemsInInv(item_id)
        if (invItems.length > 0) {
            const owners = invItems.map(it => it.name)
            throw new Error(`Item is still being used by ${owners.join(', ')}`)
        }
    })
]