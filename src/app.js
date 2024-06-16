import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import videoRouter from './routes/video.routes.js';
import CommentRouter from './routes/comments.routes.js';
import { mongooseMiddleware } from './db/index.js';

const app = express();
app.use(
  cors({
    origin: process.env.CROS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: '150kb',
  }),
);
app.use(
  urlencoded({
    limit: '150kb',
    extended: true,
  }),
);
app.use(express.static('public'));
app.use(mongooseMiddleware)

app.use(cookieParser());

import userRouter from './routes/user.routes.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/comments', CommentRouter);

export { app };
