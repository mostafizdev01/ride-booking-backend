import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('WellCome to Ride Booking Backend!');
});

app.get('/ride', (req, res) => {
  res.send("This is Ride page..");
});

export default app;
