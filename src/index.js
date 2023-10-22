const app = require("./app");
const connectDB = require("./config/db.config");
const {
  SERVER_PORT,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} = require("./secret");

const cloudinary = require("cloudinary");

/* 
  setup cloudinary
*/
cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

/* 
    listen on port number
*/

app.listen(SERVER_PORT, async () => {
  console.log(`listening on port ${SERVER_PORT}`);

  // calling mongodb connection

  await connectDB();
});
