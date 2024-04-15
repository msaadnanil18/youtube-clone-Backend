import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import { publishAVideo } from "../controllers/video.controller.js";
import { getAllVideos } from "../controllers/video.controller.js";
import { deleteVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

 const videoRouter = Router()

 videoRouter.route('/uploads').post(
    verifyJWT,
    upload.fields([
        {
            name:'videoFile',
            maxCount:1
        },
        {
            name:'thumbnail',
            maxCount:1
        }
    ]),
    publishAVideo
)
videoRouter.route('/list-videos').get(getAllVideos)
videoRouter.route('/delete/:videoId').delete(deleteVideo)

 export default videoRouter
