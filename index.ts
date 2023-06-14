import express , { Router , Request, Response } from "express";

const app = express();

// server , socket.io設定
import { createServer } from 'http';
import { Server } from 'socket.io';
const server = createServer(app);
const io = new Server(server);