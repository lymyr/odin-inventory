import { body } from "express-validator";
import generalValidation, { validateIdBody } from "./generalValidation.js";
import { getPerson, getPersonByName, getPersonInInv } from "../db/query.js";

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

export const validateDeletePerson = [
    validateIdBody,
    validatePersonByIdExists,
    body('id').custom(async person_id => {
        const personInv = await getPersonInInv(person_id)
        if (personInv.length > 0)
            throw new Error(`${personInv[0].name} still has items in inventory`)
    })
]