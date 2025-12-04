import config  from "./config";
import express, { NextFunction, Request, Response } from "express";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

const app = express();
const port = config.port;


//initializing db
initDB();


//middleware
app.use(express.json());
// app.use(express.urlencoded()) //for FORM DATA

app.get("/",logger, (req: Request, res: Response) => {
  res.send("Full Stack Developer!");
});


// user router
app.use("/users", userRoutes);


//todos crud
//post a todos
app.post("/todos", async(req, res) => {
  const {user_id,title} = req.body

  try{

    const result = await pool.query(
      `INSERT INTO todos(user_id,title) VALUES($1, $2) RETURNING *`,[user_id,title]
    )

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
});

//get a todos
app.get("/todos",async(req:Request,res:Response) => {
  try{
    const result = await pool.query(`SELECT * FROM todos`);

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
})




app.use((req,res) => {
  res.status(404).json({
    success : false,
    message : "Route not Found",
    path: req.path
  })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
