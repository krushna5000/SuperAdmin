import express from "express";
import dotenv from "dotenv";
dotenv.config();
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
