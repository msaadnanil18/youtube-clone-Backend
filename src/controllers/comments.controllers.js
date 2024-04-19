import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comments } from '../models/comments.model.js';

const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.prams;
  const { page = 1, limit = 10 } = req.query;

  const listComments = Comments.find({ video: videoId })
    .populate('video', 'owner')
    .skip((page - 1) * limit)
    .limit(limit);
  return res.status(201).json(new ApiResponse(200, listComments));
});

const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const [videoId] = req.params;
  if (comment.trim() === '') {
    throw new ApiError(400, 'Pease enter comments');
  }

  try {
    const comments = await Comments.create({
      comment,
      video: videoId,
      owner: req?.req.user?._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(200, comments, 'Your comments successfully save'));
  } catch (error) {
    throw new ApiError('Error while creating comments');
  }
});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await Comments.findByIdAndDelete(commentId);

    return res
      .status(201)
      .json(
        new ApiResponse(200, deletedComment, 'your comments is is deleted'),
      );
  } catch (error) {
    throw new ApiError('error while deleting comment');
  }
});

export { getVideoComment, addComment, updateComment, deleteComment };
