import express, { Request, Response, Application } from 'express';
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
const routesRegex = /^(\/|\/profile|\/video|\/chat|\/room)$/;

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/auth', authPage);

app.get(routesRegex, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.use('/not-found', (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  res.send('Not Found');
});

app.use((req: Request,res: Response) => {
  res.redirect('/not-found')
});

export default app;
