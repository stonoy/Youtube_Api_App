const express = require("express")
const ytRouter = express.Router()
const {getAllvideos, getAllComments, postComments, changeTitle, deleteComments, refreshToken} = require("../controllers/youtube")

ytRouter.get("/getallvideos/:channelId", getAllvideos)
ytRouter.get("/getallcomments/:videoId", getAllComments)
ytRouter.post("/postcomment", postComments)
ytRouter.patch("/changetitle", changeTitle)
ytRouter.delete("/deletecomment/:commentId", deleteComments)
ytRouter.get("/refreshtoken", refreshToken)

module.exports = ytRouter