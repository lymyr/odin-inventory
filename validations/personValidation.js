import { body } from "express-validator";
import generalValidation, { validateIdBody, validateNameLength } from "./generalValidation.js";
import { getPerson, getPersonByName, getPersonByNameFilterId, getPersonInInv } from "../db/query.js";

export const validatePerson = [
    ...generalValidation,
    validateNameLength(50),
    body('name').custom(async value => {
        const person = await getPersonByName(value)
        if (person.length > 0)
            throw new Error('Person already exists')
    })
]

export const validatePersonByIdExists = [
    ...generalValidation,
    body('name').custom(async (name, {req, res}) => {
        const person = await getPerson(req.body.id)
        if (person.length !== 1)
            throw new Error('Invalid id')
        const dupliPerson = await getPersonByNameFilterId(req.body.id, name)
        if (dupliPerson.length > 0)
            throw new Error('Person already exists')
    })
]

export const validateDeletePerson = [
    validateIdBody,
    body('id').custom(async person_id => {
        const personInv = await getPersonInInv(person_id)
        if (personInv.length > 0)
            throw new Error(`${personInv[0].name} still has items in inventory`)
    })
]