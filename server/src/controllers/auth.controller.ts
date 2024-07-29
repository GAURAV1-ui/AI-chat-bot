import { Request, Response, NextFunction } from "express";
import User from '../models/auth.model';
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/createToken";

export const userRegister = async(req: Request, res: Response, next: NextFunction) => {
    
    try {
        const {name, email, password} = req.body;

        console.log(password);

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

    const token = createToken(user._id.toString(), user.email);
    res.cookie("auth-token", token);
    return res
    .status(200)
    .json({ name: user.name, email: user.email,token: token });
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "User not loggedin"});
    }
}