import { body } from "express-validator";
import generalValidation from "./generalValidation.js";
import { 
    getCategoryById, 
    getSameNameCategory,
    getSameNameUpdateCategory
} from "../db/query.js";

export const validateAddCategory = [
    ...generalValidation,
    body('name').custom(async value => {
        const sameName = await getSameNameCategory(value);
        if (sameName.length > 0)
            throw new Error('Category already exists')
    })
]

export const validateUpdateCategory = [
    ...generalValidation,
    body('name').custom(async (value, {req, res}) => {
        const sameName = await getSameNameUpdateCategory(req.body.id, value)
        if (sameName.length > 0)
            throw new Error('Category already exists')
    })
]

export const validateCategoryExists = body('id').isInt().bail()
    .toInt().custom(async value => {
        const cat = await getCategoryById(value)
        if (cat.length == 0)
            throw new Error('Category doesn\'t exist')
    })