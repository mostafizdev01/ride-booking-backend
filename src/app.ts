import express from 'express';
import { router } from './app/routes';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import passport from 'passport';
import  Expression  from 'express-session';

const app = express();

app.use(Expression({
  secret: "your secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get('/', (req, res) => {
  res.status(200).json({message: "WellCome to Ride Booking Backend!"})
});

app.use("/api/v1", router)

export default app;
