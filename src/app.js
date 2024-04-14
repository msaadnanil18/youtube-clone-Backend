import  express, { urlencoded }  from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import videoRouter from "./routes/video.routes.js";

const app = express()
app.use(cors({
    origin: process.env.CROS_ORIGIN,
    credentials:true
}))

 
app.use(express.json({ 
    limit: "16kb"
}))
app.use(urlencoded({
    limit:"16kb",
    extended:true
}))
app.use(express.static("public"))

app.use(cookieParser())

import userRouter from './routes/user.routes.js'

app.use("/api/v1/users", userRouter)
app.use('/api/v1/videos',videoRouter)

export {app}
 

