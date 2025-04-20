const mongoose = require("mongoose")

const LogSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: {
            values: ["Title_Change", "Comment_Added", "Comment_Deleted", "Get_Comments", "Get_Videos", "Access_Token_Fetched"],
            message: "action type did not match"
        },
        required: true,
    }
}, {timestamps: true})

const Log = mongoose.model("Log", LogSchema)

module.exports = Log