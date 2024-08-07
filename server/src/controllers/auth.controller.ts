import { Request, Response, NextFunction } from "express";
import User from '../models/auth.model';
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/createToken";

interface CustomRequest extends Request {
    userId?: string;
  }

export const userRegister = async(req: Request, res: Response, next: NextFunction) => {
    
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(401).json({message: "User already exist"});
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        const createdUser = await user.save();
        if(!createdUser){
            return res.status(401).json({message: "User not created"});
        }
        return res.status(201).json({name: createdUser.name, email: createdUser.email});
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "User not created"});
    }
}

export const userLogin = async(
    req: Request, res: Response, next: NextFunction
) => {
    
    try {
        const {email, password} = req.body;

    if(!email || !password){
        throw new Error("Either email or password doesn't exist");
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(401).send("User not registered");
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Incorrect Password");
    }

    res.clearCookie("token");

    const token = createToken(user._id.toString(), user.email);
    res.cookie("token", token);
    return res
    .status(200)
    .json({ name: user.name, email: user.email,token: token });
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "User not loggedin"});
    }
}

export const userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const user = await User.findById((req as CustomRequest).userId);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
  
      res.clearCookie("token");
  
      return res
        .status(200)
        .json({ message: "OK"});
    } catch (error) {
      console.log(error);
      return res.status(200).json({message: "Something went wrong"});
    }
  };