import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDb } from "./db";

import chatRoutes from './routes/chat.router';
import authRoutes from './routes/auth.router';

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 8000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("", chatRoutes);
app.use("", authRoutes);

connectDb()
  .then(() => {
    app.listen(port, () =>
      console.log("Server Open & Connected To Database 🤟")
    );
  })
  .catch((err) => console.log(err));