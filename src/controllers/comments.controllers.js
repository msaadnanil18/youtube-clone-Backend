import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comments } from '../models/comments.model.js';

const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.prams;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const [videoId] = req.params;
  if (comment.trim() === '') {
    throw new ApiError(400, 'Pease enter comments');
  }

  const comments = await Comments.create({
    comment,
    video: videoId,
    owner: req?.req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, comments, 'Your comments successfully save'));
});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComment, addComment, updateComment, deleteComment };
