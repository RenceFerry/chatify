declare namespace Express {
  export interface Request {
    user?: {
      email: string,
      username: string,
      password: string | null,
      id?: string
    } | object,
  }
}