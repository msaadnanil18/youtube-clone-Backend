import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadCloudnary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Jwt from 'jsonwebtoken';

const gerateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'something went wrong while generating refresh and access tokens',
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'all fields are required');
  }

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    throw new ApiError(409, 'you are all ready exited');
  }

  const avatarOnLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarOnLocalPath) {
    throw new ApiError(400, 'Avatar file is required.use');
  }
  const avatar = await uploadCloudnary(avatarOnLocalPath);
  const coverImage = await uploadCloudnary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is need');
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username,
  });
  const createdUseer = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  if (!createdUseer) {
    throw new ApiError(500, 'something went wrong while register the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUseer, 'user registered successfully '));
});

const trialError = asyncHandler(async (req, res) => {
  const { a } = req.body;

  console.log(a, 'hiss');
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, 'username or password is required');
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, 'invaild user password');
  }
  const { accessToken, refreshToken } = await gerateAccessAndRefreshToken(
    user._id,
  );
  const loggendInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggendInUser,
          accessToken,
          refreshToken,
        },
        'user logied In Successfully',
      ),
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged out'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'unauthorized request token');
  }
  try {
    const decodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await gerateAccessAndRefreshToken(
      user._id,
    );

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'access token refreshed',
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token ');
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  req.User?.id;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw ApiError(400, 'Inavalid old Password');
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password change successfully'));
});

const getCurrenUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'current user is fetch successfully'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, 'all fields are required');
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        emal: email,
      },
    },
    { new: true },
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'account details update successfully '));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is missing');
  }
  const avatar = await uploadCloudnary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, 'error while uploading avatar ');
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar is update successfully'));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, 'CoverImage file is missing');
  }
  const coverImage = await uploadCloudnary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, 'error while uploading cover image ');
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true },
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'cover Image is update successfully'));
});

const userChennelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, 'username is missing');
  }
  const channael = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers',
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo  ',
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: '$subscribers',
        },
        chennaelsSubscriberedToCount: {
          $size: '$subscribedTo',
        },
        isSubscribed: {
          $con: {
            if: { $in: [req.user?._id, 'subscribers.subscriber'] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        chennaelsSubscriberedToCount: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);
  if (!channael?.length) {
    throw new ApiError(400, 'channel does not exits');
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channael[0], 'User channel fetched successfully'),
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreingField: '_id',
        as: 'watchHistory',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    usernamea: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: '$owner',
              },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        'watch history fetch succesfully',
      ),
    );
});

export {
  trialError,
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrenUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  userChennelProfile,
  getWatchHistory,
};
