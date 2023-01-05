import { check, oneOf, param } from "express-validator"

import User from "../models/user.js"
import validateSchema from "../middleware/validateSchema.js"

export const validateRegister = [
    check("name")
        .exists()
        .custom(async (value) => {
            if (await User.exists({ name: value }))
                throw new Error("Name already in use")

            return true
        }),
    check("email")
        .exists()
        .isEmail()
        .custom(async (value) => {
            if (await User.exists({ email: value }))
                throw new Error("Email already in use")

            return true
        }),
    check("password")
        .exists(),

    function (req, res, next) {
        validateSchema(req, res, next)
    }
]

export const validateLogin = [
    oneOf([
        check("name").exists(),
        check("email").exists().isEmail(),
    ], "Email or name is required to login /todo"),
    check("password").exists(),
    function (req, res, next) {
        validateSchema(req, res, next)
    }
]

export const validateDelete = [
    param("id")
        .exists()
        .isMongoId(),
    function (req, res, next) {
        validateSchema(req, res, next)
    }
]