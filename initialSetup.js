import Role, { roleList } from "./models/role.js"

function createRoles() {
    roleList.forEach((roleName) => {
        new Role({name: roleName}).save()
    })
}

Role.find({}, (err, roles) => {
    if (roles.length > 0)
        return
    createRoles()
})