import { NextFunction, Request, Response } from "express"


const credetialsLoginWithPassportJs = (req:Request, res:Response, next:NextFunction)=> {
    
   res.status(200).json({ success: true, message: "✅ Login successfull", data })
}

export const AuthControllers = {
    credetialsLoginWithPassportJs
}