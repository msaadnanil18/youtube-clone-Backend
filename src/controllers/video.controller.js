import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadCloudnary } from '../utils/cloudinary.js';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';

const getAllVideos = asyncHandler(async (req, res) => {
  const { db } = req;
  console.log(db.Video.find(), 'dbss');
  const {
    page = 1,
    limit = 10,
    query = '',
    sortBy = 'createdAt',
    sortType = 'desc',
    userId,
  } = req.query;

  const conditions = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  };
  console.log(conditions, 'conditions');

  if (userId) {
    conditions.owner = userId;
  }
  if (query) {
    conditions.$text = { $search: query };
  }

  const sortDirection = sortType.toLowerCase() === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortBy] = sortDirection;

  const listVideos = await db.Video.find(conditions)
    .populate('owner')
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const total = await Video.countDocuments(conditions);

  return res.status(200).json({
    statusCode: 200,
    data: listVideos,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, 'userId is missing');
  }

  if ([title, description].some((items) => items?.trim() === '')) {
    throw new ApiError(400, 'title and description is required');
  }

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
    owner: userId,
    duration: videos?.duration,
    videoFile: videos.url,
    thumbnail: thumbnails.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, 'video upload successfully '));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, 'Video not found'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, deletedVideo, 'Video deleted successfully'));
  } catch (error) {
    throw new ApiError(500, 'Error while deleting video', error);
  }
});

const getVideoToPlay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { db } = req;
  console.log(db, 'dbss');
  try {
    const video = await Video.findById(id);
    return res.status(200).json(new ApiResponse(200, video));
  } catch (error) {
    throw new ApiError(error, 'error while fetching videos');
  }
});

export { publishAVideo, getAllVideos, deleteVideo, getVideoToPlay };
