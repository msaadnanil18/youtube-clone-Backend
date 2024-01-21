import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadCloudnary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
  // res.status(200).json({
  //   message:"baba yaga"
  // })

  const {username, email, password, name } = req.body
  console.log("email", email)
  if (
    [fullName, email, username, password, ].some((field) => field?.trim() === "" )
  ) {
    throw new ApiError(400, "all fields are required")
  }

  const exitedUser = User.findOne({
    $or:[{username}, {email}, ]
  })
  
  if (exitedUser) {
    throw new ApiError(409, "you are all ready exited")
  }

  const avatarOnLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath =  req.files?.coverImage[0].path

  if (!avatarOnLocalPath) {
    throw new ApiError(400, "Avatar file is required")
    
  }
const avatar = await uploadCloudnary(avatarOnLocalPath)
 const coverImage  = await uploadCloudnary(coverImageLocalPath)

 if (!avatar) {
  throw new ApiError(400, "Avatar file is required")
 }
  const user =  await User.create({
      fullName,
      avatar:avatar.url,
      coverImage: coverImage?.url || "" ,
      email,
      password,
      username: username.toLowerCase()
    })
  const createdUseer = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUseer) {
    throw new ApiError(500, "something went wrong while register the user")
  }

   return status(201).json(
    new ApiResponse(200, createdUseer, "user registered successfully ")
   )
})

export {registerUser}