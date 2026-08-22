import { body } from "express-validator";

export default [
        body('name').trim()
            .notEmpty().withMessage('Name must not be empty'),
        body('description').optional().trim()
    ]