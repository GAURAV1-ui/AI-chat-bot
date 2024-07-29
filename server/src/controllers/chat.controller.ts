import { NextFunction, Request, Response } from "express";
import { ConfigOpenApi } from "../config/openAI.config";
import Chat from "../models/chat.model";



export const generateChat = async(
    req : Request,
    res: Response,
    next: NextFunction
) => {

    const openai = ConfigOpenApi();

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
        //   {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        stream: true,
      });
    
      for await (const chunk of completion) {
        console.log(chunk.choices[0].delta.content);
      }
}

