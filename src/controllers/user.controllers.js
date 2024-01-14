import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"

const registerUser = asyncHandler(async(req, res) => {
  // res.status(200).json({
  //   message:"ok"
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

})

export {registerUser}