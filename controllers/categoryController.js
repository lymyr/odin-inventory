import { body, validationResult } from "express-validator"
import { 
    getCategories as queryAll,
    addCategory as queryAdd,
    getCategoryById,
    updateCategory as queryUpdate,
    deleteCategory as queryDelete
} from "../db/query.js"

import { 
    validateAddCategory,
    validateCategoryExists,
    validateUpdateCategory
 } from "../validations/categoryValidation.js"


export async function getCategories(req, res) {
    const categories = await queryAll()
    res.render('index', {title:'Category', dataList: categories})
}

export async function getAddCategory(req, res) {
    res.render('otherForm', {title: 'Category', type: 'Add'})
}

export const addCategory = [
    validateAddCategory,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryAdd(req.body.name, req.body.description)
            return res.redirect('/category')
        }
        res.send(errs.mapped())
    }
]

export async function getUpdateCategory(req, res) {
    const cat = await getCategoryById(parseInt(req.params.id))
    if (cat.length != 0)
        return res.render('otherForm', {title: 'Category', type:'Update', id: cat[0].id, name: cat[0].name, description: cat[0].description})
    else
        throw new Error('Category doesn\'t exist')
}

export const updateCategory = [
    validateCategoryExists,
    validateUpdateCategory,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryUpdate(req.body.id, req.body.name, req.body.description)
            res.redirect('/category')
        }
        else
            res.send(errs.mapped())
    }
]

export const deleteCategory = [
    validateCategoryExists,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            await queryDelete(req.body.id)
            return res.redirect('/category')
        }
        res.send(errs.mapped())
    }
]