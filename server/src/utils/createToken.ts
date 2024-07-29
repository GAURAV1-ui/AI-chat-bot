import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const createToken = (id: string, email: string) => {
    const payload = {
        id,
        email
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET!);
    return token;
}

interface CustomRequest extends Request {
    userId?: any;
  }

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.signedCookies["auth-token"];
    if (!token ) {
      return res.status(401).send({ message: "Token Not Received" });
    }
    let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (error) {
            throw new Error("Token not valid");
      } 
        if(!verifyToken) {
            return res.status(401).json("Not Authenticated");
        }
        (req as CustomRequest).userId = decodedToken?.id;
        next();
  };