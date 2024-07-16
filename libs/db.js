import mongoose from "mongoose";

export default function connect() {
  mongoose.connection.on("connected", () => console.log("Database connected"));
  mongoose.connection.on("error", (error) =>
    console.log("Database ERROR:", error)
  );
  const url = process.env.MONGODB_CONNECTION;
  return mongoose.connect(url);
}
