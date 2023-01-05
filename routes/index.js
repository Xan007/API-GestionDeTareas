import { Router } from "express"
import site from "./site.js"
import tasks from "./tasks.js"
import users from "./users.js"

const router = Router()

const routesList = [
    site,
    tasks,
    users
]

routesList.forEach((route) => {
    console.log(`${route.endpoint}, ${route.router}, ${route.endpoint}`)
    router.use(`${route.endpoint}`, route.router)
})

export default router