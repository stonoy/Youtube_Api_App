import React, { useEffect, useState } from 'react'

import axios from "axios"
import YTVideo from './YTVideo'
import { useDispatch, useSelector } from 'react-redux'
import { generateAccessToken, getVideos } from './feature/youtubeSlice'


const channelId = "UCg-81tzITWNcBZJkBBdiclQ"

const App = () => {
  const {loading, videos} = useSelector(state => state.youtube)
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(getVideos(channelId))
  }, [])

  useEffect(() => {
    dispatch(generateAccessToken())

    const id = setTimeout(() => {
      dispatch(generateAccessToken())
    }, 1000*60*50)

    return () => {
      clearTimeout(id)
    }
  },[])

  if (videos?.length == 0){
    return <h1>No Videos to show</h1>
  }

  if (loading){
    return <h1 className='w-fit mx-auto text-xl font-semibold'>Loading...</h1>
}

  return (
    <div className='max-w-3xl mx-auto p-2 flex flex-col items-center gap-4 bg-slate-300'>
      {
        videos?.map((video,i) => {
          return (
            <YTVideo key={i} videoId={video?.id?.videoId}/>
          )
        })
      }
    </div>
  )
}

export default App