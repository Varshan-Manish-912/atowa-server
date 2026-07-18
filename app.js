import express from "express";
import cors from "cors";

import systemsRouter from "./routes/systems.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/systems", systemsRouter);

export default app;