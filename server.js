import express from "express";
import dotenv from "dotenv";
dotenv.config();
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
