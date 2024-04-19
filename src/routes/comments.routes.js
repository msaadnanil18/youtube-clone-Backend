import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addComment } from '../controllers/comments.controllers.js';
import { upload } from '../middlewares/multer.js';

const CommentRouter = Router();

CommentRouter.route('add/:videoId').post(verifyJWT, upload.fields([]), addComment);

export default CommentRouter;
