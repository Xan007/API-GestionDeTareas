import { Schema, model } from "mongoose"

export const roleList = ["user", "moderator", "admin"]

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

roleSchema.static("findByName", async(roleName) => {
    return await this.findOne({name: roleName})
})

const Role = model("Role", roleSchema)

export default Role