import app from "./app";
import mongoose from "mongoose";
import config from "./config";

const port = config.PORT;
console.log("Port: " + port)
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("Mongoose Connected");
    app.listen(port, () => {
      console.log("Server Running on port: " + port);
    });
  })
  .catch(console.error);
