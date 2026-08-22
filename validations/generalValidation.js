import { body, param } from "express-validator";

export default [
        body('name').trim()
            .notEmpty().withMessage('Name must not be empty'),
        body('description').optional().trim()
    ]

export const validateIdParam = param('id').isInt().toInt()
export const validateIdBody = body('id').isInt().toInt()