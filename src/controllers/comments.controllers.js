import mongoose  from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const getVideoComment = asyncHandler(async(req, res) => {
   const {videoId} = req.prams
   const {page=1 , limit = 10} = req.query

})

const addComment = asyncHandler(async(req, res) => {})

const updateComment = asyncHandler(async(req, res) => {})

const deleteComment = asyncHandler(async(req, res) => {})

export {
      getVideoComment,
      addComment,
      updateComment,
      deleteComment
}