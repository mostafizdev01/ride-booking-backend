import express from 'express';
import { router } from './app/routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('WellCome to Ride Booking Backend!');
});

app.use("/api/v1", router)

export default app;
