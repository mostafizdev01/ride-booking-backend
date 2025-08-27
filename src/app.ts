import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './app/router';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import passport from 'passport';
import expressSession from 'express-session';
import { envVars } from './app/config/env';
import './app/config/passport';

const app: Application = express()

// Middleware 
app.use(express.json())
app.use(cookieParser());
app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax"
  }
}))
app.use(passport.initialize())
app.use(passport.session())


app.use(cors({
  origin: envVars.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));


// Routes
app.use('/api/v1', router)


app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Ride Management Backend Project')
})


export default app