import { body, param } from "express-validator";
import generalValidation from "./generalValidation.js";
import { getPerson, getPersonByName } from "../db/query.js";

export const validatePerson = [
    ...generalValidation,
    body('name').custom(async value => {
        const person = await getPersonByName(value)
        if (person.length > 0)
            throw new Error('Person already exists')
    })
]

export const validatePersonByIdExists = body('id').custom(async value => {
    const person = await getPerson(value)
    if (person.length !== 1)
        throw new Error('Invalid id')
})