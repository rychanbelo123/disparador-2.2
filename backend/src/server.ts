import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import subscriptionRouter from "./routes/subscription";
import asaasRouter from "./routes/asaas";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas existentes
app.use("/api", subscriptionRouter);
app.use("/api", asaasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});