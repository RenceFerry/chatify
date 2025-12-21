import express, { Request, Response, Application } from 'express';
import { authenticate } from './controllers/auth.controller.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  authRoutes,
  authPage
} from './routes/export.js'
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesRegex = /^(\/profile|\/|\/video|\/chat|\/room)$/;

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(routesRegex, authenticate, (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/auth', authPage);

app.use('/api/auth', authRoutes);

app.use('/not-found', (req: Request, res: Response) => {
  res.send('Not Found');
});


app.use((req: Request,res: Response) => {
  res.redirect('/not-found')
});


export default app;
