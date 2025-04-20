import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { customFetch } from "../utils"
import { toast } from "react-toastify"

const initialState = {
    videos: [],
    allComments: {},
    loading: false,
    submitting: false
}

export const getVideos = createAsyncThunk("youtube/getVideos", 
    async (channelId, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/getallvideos/${channelId}`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const generateAccessToken = createAsyncThunk("youtube/generateAccessToken", 
    async (_, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/refreshtoken`)
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getComments = createAsyncThunk("youtube/getComments", 
    async (videoId, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/getallcomments/${videoId}`)
            return {comments : resp?.data?.comments, videoId}
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const postACooment = createAsyncThunk("youtube/postACooment", 
    async (data, thunkAPI) => {
        try {
            const resp = await customFetch.post(`/postcomment`, data)
            thunkAPI.dispatch(getComments(data?.videoId))
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const changeTitle = createAsyncThunk("youtube/changeTitle", 
    async (data, thunkAPI) => {
        try {
            const resp = await customFetch.patch(`/changetitle`, data)
            thunkAPI.dispatch(getVideos("UCg-81tzITWNcBZJkBBdiclQ"))
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const deleteTheComment = createAsyncThunk("youtube/deleteTheComment", 
    async ({commentId, videoId}, thunkAPI) => {
        try {
            const resp = await customFetch.delete(`/deletecomment/${commentId}`)
            thunkAPI.dispatch(getComments(videoId))
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

const youtubeSlice = createSlice({
    name: "youtube",
    initialState: JSON.parse(localStorage.getItem("youtube")) || initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getVideos.pending, (state, {payload}) => {
            state.loading = true
        }).addCase(getVideos.fulfilled, (state, {payload}) => {
            state.loading = false
            state.videos = payload?.videos
        }).addCase(getVideos.rejected, (state, {payload}) => {
            state.loading = false
            toast.error(payload)
        }).addCase(generateAccessToken.pending, (state, {payload}) => {
            state.loading = true
        }).addCase(generateAccessToken.fulfilled, (state, {payload}) => {
            state.loading = false
            toast.success(payload)
        }).addCase(generateAccessToken.rejected, (state, {payload}) => {
            state.loading = false
            toast.error(payload)
        }).addCase(postACooment.pending, (state, {payload}) => {
            state.submitting = true
        }).addCase(postACooment.fulfilled, (state, {payload}) => {
            state.submitting = false
            toast.success(payload)
        }).addCase(postACooment.rejected, (state, {payload}) => {
            state.submitting = false
            toast.error(payload)
        }).addCase(getComments.pending, (state, {payload}) => {
            state.submitting = true
        }).addCase(getComments.fulfilled, (state, {payload}) => {
            state.submitting = false
            state.allComments[payload?.videoId] = payload?.comments
            
        }).addCase(getComments.rejected, (state, {payload}) => {
            state.submitting = false
            toast.error(payload)
        }).addCase(changeTitle.pending, (state, {payload}) => {
            state.submitting = true
        }).addCase(changeTitle.fulfilled, (state, {payload}) => {
            state.submitting = false
            toast.success(payload)
        }).addCase(changeTitle.rejected, (state, {payload}) => {
            state.submitting = false
            toast.error(payload)
        }).addCase(deleteTheComment.pending, (state, {payload}) => {
            state.submitting = true
        }).addCase(deleteTheComment.fulfilled, (state, {payload}) => {
            state.submitting = false
            toast.success(payload)
        }).addCase(deleteTheComment.rejected, (state, {payload}) => {
            state.submitting = false
            toast.error(payload)
        })
    }
})

export default youtubeSlice.reducer