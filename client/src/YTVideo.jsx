import React, { useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { changeTitle, deleteTheComment, getComments, postACooment } from './feature/youtubeSlice'

const YTVideo = ({videoId}) => {
    const {loading, submitting, allComments} = useSelector(state => state.youtube)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    
    const dispatch = useDispatch()

    const comments = allComments[videoId]

    const postComment = async () => {
        if (!comment) return

       dispatch(postACooment({comment, videoId}))

       setComment("")
    }


    const addTitle = async () => {
        if (!title) return

        dispatch(changeTitle({title, videoId}))

        setTitle("")
    }

    const deleteComment = async (commentId) => {
      dispatch(deleteTheComment({commentId, videoId}))
    }
    

  return (
    <div>
        <div className="w-full max-w-lg mx-auto p-2">
      <div className="relative w-full pt-[56.25%]"> 
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div>
        {/* add titles and comments */}
        <div className='mt-2'>
      <div>
        <label htmlFor="title">Video Title : </label>
        <input className='border-2 rounded-md p-1' type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <button className='py-1 px-4 rounded-md bg-gray-400' disabled={submitting} onClick={addTitle}>Update</button>
      </div>
      <div>
      <div>
        <label htmlFor="comment">Comment : </label>
        <input className='border-2 rounded-md p-1' type='text' id='comment' value={comment} onChange={(e) => setComment(e.target.value)}/>
      </div>
      <button className='py-1 px-4 rounded-md bg-gray-400' disabled={submitting} onClick={postComment}>Add</button>
      </div>
      <div>
        <button className='mt-2' disabled={submitting} onClick={() => dispatch(getComments(videoId))}>Get Comments</button>
        {/* show cooments */}
        <div>
            {
                comments?.map(comment => {
                    return (
                        <div key={comment?.id} className='border-2 flex justify-between items-center p-1'>
                            <h1>{comment?.snippet?.topLevelComment?.snippet?.textDisplay}</h1>
                            <button disabled={submitting} onClick={() => deleteComment(comment?.id)}>Delete</button>
                        </div>
                    )
                })
            }
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default YTVideo