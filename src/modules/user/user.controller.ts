import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

//post a user
const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await userService.createUser(name, email);

    res.status(200).send({
      success: true,
      message: "Data Inserted Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get all user
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUser();

    res.status(200).json({
      success: true,
      message: "successfully retrieved",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single user
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSingleUser(req.params.id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//update user
const updateUser = async(req:Request,res:Response) => {
    const {name,email} = req.body
    try{
      const result = await userService.updateUser(name,email,req.params.id as string)
  
      res.status(200).json({
        success:true,
        message:"successfully retrieved",
        data : result.rows
      })
  
    }catch(error:any){
      res.status(500).json({
        success:false,
        message:error.message
      })
    }
  }

  //delete user
  const deleteUser =  async(req:Request,res:Response) => {
  
    try{
      const result = await userService.deleteUser(req.params.id as string)
  
      if(result.rowCount === 0){
        console.log(result.rowCount)
         res.status(404).json({
          success:false,
          message : "User not Found"
         })
      }else {
        res.status(200).json({
          success:true,
          message : "User Deleted Succesfully",
          data : result.rows
        })
      }
    }catch(err:any){
      res.status(500).json({
        success : false,
        message:err.message
      })
    }
  
  }
export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
};
