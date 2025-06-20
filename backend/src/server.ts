import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import subscriptionRouter from "./routes/subscription";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas existentes
app.use("/api", subscriptionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});