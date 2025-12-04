import { Request, Response } from "express"
import { pool } from "../../config/db"
import { userService } from "./user.service"


const createUser = async(req:Request, res:Response) => {
    const {name,email} = req.body
  
    try{
  
     const result =  await userService.createUser(name , email)
  
      res.status(200).send({
        success : true,
        message : "Data Inserted Successfully",
        data : result.rows[0]
  
      })
  
    }catch(err:any){
      res.status(500).json({
        success:false,
        message : err.message
      })
    }
  }

  export const userController = {
    createUser
  }