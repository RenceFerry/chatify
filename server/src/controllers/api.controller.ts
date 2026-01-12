import { Request, Response } from 'express';

export const getId = (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect('/auth/login');

  //@ts-ignore
  res.send(`${user.id}`)
}