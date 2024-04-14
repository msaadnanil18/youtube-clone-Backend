import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadCloudnary } from '../utils/cloudinary.js';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, owner } = req.body;

  console.log(title, description);

  const thumbnailOnLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailOnLocalPath) {
    throw new ApiError(400, 'thumbnail is required');
  }

  const thumbnails = await uploadCloudnary(thumbnailOnLocalPath);
  const videoFileOnLocalPath = req.files?.videoFile[0]?.path;

  if (!videoFileOnLocalPath) {
    throw new ApiError(400, 'video file is required');
  }

  const videos = await uploadCloudnary(videoFileOnLocalPath);

  const createdVideo = await Video.create({
    title,
    description,
    owner,
    videoFile: videos.url,
    thumbnail: thumbnails.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, 'video upload successfully ', createdVideo));
});

export { publishAVideo };
