import { validationResult } from "express-validator"
import { 
    getPeople as queryAll,
    addPerson as queryAdd,
    getPerson,
    updatePerson as queryUpdate,
    deletePerson as queryDelete
} from "../db/query.js"
import { validatePerson, validatePersonByIdExists } from "../validations/personValidation.js"
import { validateIdBody, validateIdParam } from "../validations/generalValidation.js"

export async function getPeople(req, res) {
    const persons = await queryAll()
    res.render('index', {title: 'Person', dataList: persons})
}

export async function getAddPerson(req, res) {
    res.render('otherForm', {title: 'Person', type: 'Add'})
}

export const addPerson = [
    validatePerson,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryAdd(req.body.name)
            return res.redirect('/person')
        }
        res.send(errs.mapped())
    }
]

export const getUpdatePerson = [
    validateIdParam,
    async (req, res) => {
        const person = await getPerson(req.params.id)
        res.render('otherForm', {title: 'Person', type: 'Update', id: person[0].id, name: person[0].name})
    }
]

export const updatePerson = [
    ...validatePerson,
    validatePersonByIdExists,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryUpdate(req.body.id, req.body.name)
            return res.redirect('/person')
        }
        res.send(errs.mapped())
    }
]

export const deletePerson = [
    validateIdBody,
    validatePersonByIdExists,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryDelete(req.body.id)
            return res.redirect('/person')
        }
        res.send(errs.mapped())
    }
]