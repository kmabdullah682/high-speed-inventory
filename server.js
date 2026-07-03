import "dotenv/config";
import app, { redis } from "./src/app.js";
import { connectDB } from "./src/app.js";

const PORT = 3000;

redis.on("connect", () => {
  console.log(`redis is running on this project`);
});

connectDB();

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
