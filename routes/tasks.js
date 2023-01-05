import { Router } from "express";

import { checkRole, verifyToken, userHasRole } from "../middleware/auth.js"
import { validateCreation, validateSearch } from "../validators/tasks.js"

import Task from "../models/task.js"
import User from "../models/user.js";
import { param } from "express-validator";

async function checkIdParam(req, res, next) {
    const idResult = await param("id").isMongoId().run(req, {dryRun: true})

    if (idResult.isEmpty())
        return next()
    res.status(400).send(`La ID: ${req.params.id} no es valida`)
}

const router = Router()

//Obtener todas las tareas
router.get("/", verifyToken, checkRole("user"), async(req, res) => {
    const tasks = await Task.find({creatorId: req.id})

    res.send(tasks)
})

//Obtener todas las tareas de todos
router.get("/all", verifyToken, checkRole("admin", "moderator"), async(req, res) => {
    const tasks = await Task.find()

    res.send(tasks)
})

//Obtener tarea con id
router.get("/:id", verifyToken, checkRole("user"), checkIdParam, async(req, res) => {
    const { id } = req.params

    let task = null

    if (userHasRole(req.id, "admin", "moderator"))
        task = await Task.findById(id)
    else {
        task = await Task.find({_id: id, creatorId: id})
    }
    if (!task)
        return res.status(404).send(`No se encontro una task con el id: ${id}`)
    res.send(task)
})

//Busqueda tareas
router.get("/search", verifyToken, checkRole("user"), validateSearch, async(req, res) => {
    const { difficulty, category } = req.query
    let searchObj = {creatorId: req.id}

    if (difficulty)
        searchObj.difficulty = difficulty
    if (category)
        searchObj.category = category

    const Tasks = await Task.find(searchObj)

    res.send(JSON.stringify(Tasks))
})

//Eliminar tarea
router.delete("/:id", verifyToken, checkRole("user"), checkIdParam, async(req, res) => {
    const { id } = req.params
    let task = null

    if (userHasRole(req.id, "admin", "moderator")) {
        task = await Task.findOneAndDelete({_id: id})    
    } else {
        task = await Task.findOneAndDelete({ creatorId: req.id, _id: id })
    }

    if (!task)
        return res.status(404).send(`No se encontro una tara con la id: ${id}`)

    res.send(`La tarea fue eliminada exitosamente:\n ${task}`) 
})

//Actualizar una tarea
router.put("/", verifyToken, checkRole("user"), async(req, res) => {
    const { id, title, body, difficulty, category } = req.body
    
    let task = null
    
    if (userHasRole(req.id, "admin", "moderator")) {
        task = await Task.findById(id)
    } else {
        task = await Task.find({ creatorId: req.id, _id: id })
    }

    if (!task) 
        return res.status(400).send(`No se encontro una task con la id: ${id}`)

    await task.updateOne({
        title: title || task.title,
        body: body || task.body,
        difficulty: difficulty || task.difficulty,
        category: category || task.category,
    })
})

//Crear tarea
router.post("/", verifyToken, checkRole("user"), validateCreation, async(req, res) => {
    const createdTask = new Task({
        creatorId: req.id, 
        ...req.body
    })
    await createdTask.save()

    res.send(createdTask)
})

export default { router: router, endpoint: "/tasks"}