import { Router } from 'express';
import { upload } from '../middlewares/multer.js';
import {
  publishAVideo,
  deleteVideo,
  getAllVideos,
  getVideoToPlay,
} from '../controllers/video.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const videoRouter = Router();

videoRouter.route('/uploads').post(
  verifyJWT,
  upload.fields([
    {
      name: 'videoFile',
      maxCount: 1,
    },
    {
      name: 'thumbnail',
      maxCount: 1,
    },
  ]),
  publishAVideo,
);
videoRouter.route('/list-videos').get(getAllVideos);
videoRouter.route('/play-videos/:id').get(getVideoToPlay);
videoRouter.route('/delete/:videoId').delete(deleteVideo);

export default videoRouter;

/* PORT = 8000
MONGODB_URL = mongodb+srv://zsasohail420:zsasohail123@cluster0.8jnmqqu.mongodb.net
CROS_ORIGIN =*
ACCESS_TOKEN_SECRET = OT5CKpW3xZgQ8oV6lRdFjYhUtfugvHDF_GH-aTbXmC7n2sL
ACCESS_TOKEN_EXPIRY = 1d
REFRESH_TOKEN_SECRET = 123-HCSDIFLHIGUil_dhjfNJDNFhdfjfgkdfk223_djkd2637
REFRESH_TOKEN_EXPIRY = 10d
CLOUDINARY_CLOUD_NAME = dd2tfcxqa
CLOUDINARY_CLOUD_KEY = 563871932418586
CLOUDINARY_API_SECRET = 4TgbRX38PvTxLKJl4VLEkFiJMLc */
