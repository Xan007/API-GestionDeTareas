import { Schema, model } from "mongoose"

export const difficultyEnum = ["facil", "medio", "dificil"]
export const categoryEnum = ["amistad", "familia", "trabajo", "amor", "hogar"]

const taskSchema = new Schema({
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: difficultyEnum
    },
    category: {
        type: String,
        required: true,
        enum: categoryEnum
    }
})

const Task = model("Task", taskSchema)

export default Task