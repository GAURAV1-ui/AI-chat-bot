import { NextFunction, Request, Response } from "express";
import { ConfigOpenApi } from "../config/openAI.config";
import mongoose from "mongoose";
import Chat from "../models/chat.model";
import User from "../models/auth.model";

interface CustomRequest extends Request {
  userId?: string;
}

export const generateChat = async(
    req : Request,
    res: Response,
    next: NextFunction
) => {

    const openai = ConfigOpenApi();

    const {message} = req.body;

    try {
      const user = await User.findById((req as CustomRequest).userId);
      if (!user)
        return res
          .status(401)
          .json({ message: "User not registered OR Token malfunctioned" });


    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": message}
        ],
        stream: true,
      });

      let response = "";
    
      for await (const chunk of completion) {
        if (chunk.choices[0].delta.content) {
        console.log(chunk.choices[0].delta.content);
        response += chunk.choices[0].delta.content;
        } 
      }

      const chat = await new Chat({
        role : "user",
        content: message,
        response:response,
        userId: user._id
      })
      
      const createdChat = await chat.save();

      user.chats.push(createdChat?._id);
      user.save();

      console.log(createdChat);

      return res.status(201).json({message:message, response:response});

} catch(error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export const getChats = async(
  req : Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const user = await User.findById((req as CustomRequest).userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

        const chats = await User.findById(user._id).populate({
          path: 'chats',
          options: { sort: { _id: -1 }, limit: 25 }
      }).exec();

      if(!chats){
        return res.status(200).json({message : "Couldn't able to generate chats"});
      }
    
      return res.status(200).json(chats?.chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }

}
