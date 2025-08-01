import express, { Application,Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import passport from 'passport';
import expressSession from 'express-session';
import { envVars } from './app/config/env';
import './app/config/passport';
import router from './app/router';

const app: Application = express()

// Middleware 
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
  }
}))
app.use(passport.initialize())
app.use(passport.session())


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));


// Routes
app.use('/api/v1', router)


app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Tour Management Backend Project')
})


export default app