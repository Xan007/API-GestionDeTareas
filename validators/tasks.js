import { check, query, oneOf } from "express-validator"

import validateSchema from "../middleware/validateSchema.js"

import { difficultyEnum, categoryEnum } from "../models/task.js"

export const validateCreation = [
    check("title")
        .exists(),
    check("body")
        .exists(),
    check("difficulty")
        .exists()
        .isIn(difficultyEnum),
    check("category")
        .exists()
        .isIn(categoryEnum),
    function (req, res, next) {
        validateSchema(req, res, next)
    }
]

export const validateSearch = [
    oneOf([
        query("difficulty")
            .isIn(difficultyEnum),
        query("category")
            .isIn(categoryEnum)
    ], "Difficulty or category must be given"),
    function (req, res, next) {
        validateSchema(req, res, next)
    }
]

export const validateUpdate = [
    check("id")
        .exists()
        .isMongoId(),
    oneOf([
        check("title")
            .exists(),
        check("body")
            .exists
    ], "Title or body must be given"),
    check("difficulty")
        .isIn(difficultyEnum),
    check("category")
        .isIn(categoryEnum)
]