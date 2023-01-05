import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    roles: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "Role"
        }
    ],
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

userSchema.method("encryptPassword", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.method("validatePassword", async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
})

const User = model("User", userSchema)

export default User