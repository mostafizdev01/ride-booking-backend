import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('WellCome to Ride Booking Backend!');
});

export default app;
