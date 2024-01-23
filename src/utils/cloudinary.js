import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudnary = async (localFilePath) => {
  try {
    if(!localFilePath) return null
  const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto"
    })
    console.log("file is upload on cloudnary", response.url)
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
     fs.unlinkSync(localFilePath)
    console.log("cloudinary upload error", error)
     return null 
  }
}

export {uploadCloudnary}


  