import app from "./app";

const port = 5000;

app.listen(port, () => {
  console.log(`Ride booking server is running on port ${port}`);
})