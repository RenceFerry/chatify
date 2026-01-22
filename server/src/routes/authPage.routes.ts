import { Router, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

router.get(/^(\/login|\/signup|\/verify)$/, (req: Request, res: Response) => {
  console.log('login')
  res.status(200).sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
})

export default router;