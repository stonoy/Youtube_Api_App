const Log = require("../models/log")
const axios = require("axios")

let access_token = process.env.YT_ACCESS_TOKEN

const getAllvideos = async (req, res) => {
    const {channelId} = req.params

    // get the videos of the channel from yt by this channelId
    const resp = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_KEY}&channelId=${channelId}`)

    const videos = resp?.data?.items.filter(item => Object.keys(item?.id).includes("videoId"))

    // log it
    const newLog = new Log({
        action: "Get_Videos"
    })

    await newLog.save()

    // send required part to fe
    res.status(200).json({videos})
}

const refreshToken = async (req, res) => {
    
     const resp = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
        client_id: process.env.YT_CLIENT_ID,
        client_secret: process.env.YT_CLIENT_SECRET,
        refresh_token: process.env.YT_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
      {
        headers : {
            "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
    
    access_token = resp?.data?.access_token

    

    // log it
    const newLog = new Log({
        action: "Access_Token_Fetched"
    })

    await newLog.save()

    

    res.status(200).json({msg: "acces_token generated"})
}

const getAllComments = async (req, res) => {
    const {videoId} = req.params

    const resp = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10`, {
        headers: {
            Authorization : `Bearer ${access_token}`
        }
    })

    // log it
    const newLog = new Log({
        action: "Get_Comments"
    })

    await newLog.save()

    res.status(200).json({comments: resp?.data?.items})
}

const postComments = async (req, res) => {
    const {comment, videoId} = req.body

    const body = {
        snippet: {
          topLevelComment: {
            snippet: {
              videoId,
              textOriginal: comment
            }
          }
        }
      }

    const resp = await axios.post(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet`, body, {
        headers : {
            Authorization : `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    })

    // log it
    const newLog = new Log({
        action: "Comment_Added"
    })

    await newLog.save()

    res.status(201).json({msg : "comment added"})
}

const changeTitle = async (req, res) => {
    const {title, videoId} = req.body

    const body = {
        id: videoId,
        snippet: {
          title,
          categoryId: "22"
        }
      }

    const resp = await axios.put(`https://www.googleapis.com/youtube/v3/videos?part=snippet`, body, {
        headers : {
            Authorization : `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    })

    // log it
    const newLog = new Log({
        action: "Title_Change"
    })

    await newLog.save()

    res.status(201).json({msg : "title changed"})
}

const deleteComments = async (req, res) => {
    const {commentId} = req.params

    // get the videos of the channel from yt by this channelId
    const resp = await axios.delete(`https://www.googleapis.com/youtube/v3/comments?id=${commentId}`, {
        headers : {
            Authorization : `Bearer ${access_token}` 
        }
    })

    // log it
    const newLog = new Log({
        action: "Comment_Deleted"
    })

    await newLog.save()

    // send required part to fe
    res.status(200).json({msg : "comment deleted"})
}

module.exports = {getAllvideos, getAllComments, postComments, changeTitle, deleteComments, refreshToken}