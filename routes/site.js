import { Router } from "express";

import User from "../models/user.js"
import Role from "../models/role.js"
import { verifyToken, signToken } from "../middleware/auth.js"

import { validateRegister, validateLogin } from "../validators/users.js"

const router = Router()

router.get("/", async (req, res) => {
    res.send("Bienvenido!")
})

router.post("/register", validateRegister, async (req, res) => {
    //const { name, email, password } = req.body

    let createdUser = new User({ 
        ...req.body,
        roles: [
            await Role.exists({name: "user"})
        ] 
    })
    await createdUser.encryptPassword()
    await createdUser.save()
    
    createdUser = createdUser.toObject()
    delete createdUser.password
    delete createdUser.__v

    const token = signToken(createdUser)

    res.send({
        user: createdUser,
        token: token
    })
})

router.get("/me", verifyToken, async (req, res) => {
    let user = await User.findOne({_id: req.id}).select("-password -__v")
   
    if (!user)
        return res.status(404).send("No valid user with ID")

    res.send(user)
})

router.post("/login", validateLogin, async (req, res) => {
    const { name, email, password } = req.body

    let user = null

    if (name) {
        user = await User.findOne({ name: name })
    } else if (email) {
        user = await User.findOne({ email: email })
    } else {
        return res.status(400).send("Name or email is required to login")
    }
    
    if (!user)
        return res.status(404).send("Couldn't find a user that match with name or email")

    const passwordValid = await user.validatePassword(password)
    if (!passwordValid)
        return res.status(401).send("Password is not valid")

    const token = signToken(user)

    res.send({
        token: token
    })
})

export default { router: router, endpoint: "/" }