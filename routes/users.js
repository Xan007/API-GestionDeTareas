import { Router } from "express";

import { validateDelete } from "../validators/users.js"
import { verifyToken, checkRole } from "../middleware/auth.js";

import User from "../models/user.js"

const router = Router()

router.delete("/:id", verifyToken, checkRole("admin"), validateDelete, async(req, res) => {
    const id = req.params.id

    try {
        const info = await User.deleteOne({
            _id: id
        })

        if (info.deletedCount > 0)
            res.send(`Usuario eliminado con id: ${id}`)
        else
            res.status(404).send(`No existe un usuario con la id: ${id}`)
    } catch (err) {
        res.status(400).send(`Sucedio un error: ${err}`)
    }
})

export default { router: router, endpoint: "/users"}