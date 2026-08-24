import { body, param } from "express-validator";

export default [
        body('name').trim()
            .notEmpty().withMessage('Name must not be empty'),
        body('description').optional().trim().isLength({max: 255}).withMessage('Description must not exceed 255 characters')
    ]

export const validateIdParam = param('id').isInt().toInt()
export const validateIdBody = body('id').isInt().toInt()
export const validateNameLength = (maxLength) => body('name').isLength({max: maxLength}).withMessage(`Name must not exceed ${maxLength} characters`)