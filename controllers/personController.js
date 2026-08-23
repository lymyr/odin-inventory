import { validationResult } from "express-validator"
import { 
    getPeople as queryAll,
    addPerson as queryAdd,
    getPerson,
    updatePerson as queryUpdate,
    deletePerson as queryDelete
} from "../db/query.js"
import { validateDeletePerson, validatePerson, validatePersonByIdExists } from "../validations/personValidation.js"
import { validateIdParam } from "../validations/generalValidation.js"

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
        res.render('otherForm', {
            title: 'Person',
            type: 'Add',
            errors: errs.mapped(),
            name: req.body.name
        })
    }
]

export const getUpdatePerson = [
    validateIdParam,
    async (req, res) => {
        const person = await getPerson(req.params.id)
        if (person.length < 1)
            throw new Error('Person not found')
        res.render('otherForm', {title: 'Person', type: 'Update', id: person[0].id, name: person[0].name})
    }
]

export const updatePerson = [
    ...validatePersonByIdExists,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryUpdate(req.body.id, req.body.name)
            return res.redirect('/person')
        }
        res.render('otherForm', {
            title: 'Person',
            type: 'Update',
            errors: errs.mapped(),
            id: req.body.id, 
            name: req.body.name
        })
    }
]

export const deletePerson = [
    ...validateDeletePerson,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryDelete(req.body.id)
            return res.redirect('/person')
        }
        const persons = await queryAll()
        res.status(400).render('index', {title:'Person', dataList: persons, errors: errs.array()})
    }
]