import { validationResult } from "express-validator"
import { 
    getCategories,
    getItemsCategory as queryAll,
    addItem as queryAdd,
    getItemCategory,
    updateItem as queryUpdate,
    deleteItem as queryDelete
} from "../db/query.js"
import { itemDeleteValidation, itemUpdateValidation, itemValidation } from "../validations/itemValidation.js"
import { validateIdParam } from "../validations/generalValidation.js"

export async function getItems(req, res) {
    const items = await queryAll()
    res.render('index', {title: 'Item', dataList: items})
}

export async function getAddItem(req, res) {
    const categories = await getCategories()
    res.render('otherForm', {title: "Item", type: "Add", categories: categories})
}

export const addItem = [
    ...itemValidation,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            const queryRes = await queryAdd(req.body.name, req.body.description, req.body.category)
            if (queryRes !== 200)
                throw new Error(queryRes)
            return res.redirect('/item')
        }
        res.send(errs.mapped())
    }
]

export const getUpdateItem = [
    validateIdParam,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            const {item, category} = await getItemCategory(req.params.id)
            return res.render('otherForm', {title: 'Item', type:'Update', id: item[0].id, name: item[0].name, description: item[0].description, itemCategories: item[0].category, categories: category})
        }
            
        res.send(errs.mapped())
    }
]

export const updateItem = [
    ...itemUpdateValidation,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryUpdate(
                req.body.id, 
                req.body.name, 
                req.body.description,
                req.body.category
            )
            return res.redirect('/item')
        }
        res.send(errs.mapped())
    }
]


export const deleteItem = [
    ...itemDeleteValidation,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryDelete(req.body.id)
            return res.redirect('/item')
        }
        res.send(errs.mapped())
    }
]