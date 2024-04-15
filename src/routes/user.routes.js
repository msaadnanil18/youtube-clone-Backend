import { Router } from 'express';
import {
  logOutUser,
  loginUser,
  trialError,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrenUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  userChennelProfile,
  getWatchHistory,
} from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser,
);
router.route('/trial').post(trialError);
router.route('/login').post(upload.fields([]), loginUser);
router.route('/logout').post(verifyJWT, logOutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrenUser);
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router
  .route('/avatar')
  .patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router
  .route('/cover-image')
  .patch(verifyJWT, upload.single('coverImgae'), updateUserCoverImage);
router.route('/channel/:username').get(verifyJWT, userChennelProfile);
router.route('/history').get(verifyJWT, getWatchHistory);

export default router;
