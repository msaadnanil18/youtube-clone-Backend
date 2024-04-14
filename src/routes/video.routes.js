import { Router } from "express";
import { upload } from '../middlewares/multer.js';
import { publishAVideo } from "../controllers/video.controller.js";

 const videoRouter = Router()

 videoRouter.route('/').post(
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


 export default videoRouter
