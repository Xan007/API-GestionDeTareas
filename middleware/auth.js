import jwt from "jsonwebtoken"
import User from "../models/user.js"
import Role from "../models/role.js"

export const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token)
        return res.status(401).send("No token provided")

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        if (decodedToken.id) {
            req.id = decodedToken.id
            next()
        } else
            return res.status(401).send("Token invalid")
    } catch (err) {
        return res.status(400).send(`Ocurrió un error: ${err}`)
    }
}

export const signToken = (user) => {
    return jwt.sign({
        id: user._id
    }, process.env.SECRET_KEY, {
        expiresIn: "1d"
    })
}

export const userHasRole = async (user_id, ...roles) => {
    let role_ids = []

    for (const roleName of roles) {
        let role = await Role.findOne({ name: roleName })

        if (role) {
            role_ids.push(role._id)
        }
    }

    const user = await User.findOne({ _id: user_id, roles: { $in: role_ids } })

    return user
}

export const checkRole = (...roles) => {
    return async function (req, res, next) {
        const user = userHasRole(req.id, ...roles)

        if (user)
            return next()

        res.status(400).send("You don't have permissions")
    }
}