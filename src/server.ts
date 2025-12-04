import config  from "./config";
import express, { NextFunction, Request, Response } from "express";
import initDB, { pool } from "./config/db";

const app = express();
const port = config.port;


//initializing db
initDB();

const logger = (req:Request,res:Response,next:NextFunction) => {
  console.log(`${req.path} ${req.method}`)
  next()
}

//middleware
app.use(express.json());
// app.use(express.urlencoded()) //for FORM DATA

app.get("/",logger, (req: Request, res: Response) => {
  res.send("Full Stack Developer!");
});


//users crud

// post user
app.post("/users", async(req, res) => {
  const {name,email} = req.body

  try{

    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`,[name,email]
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

//all user get
app.get("/users",async(req:Request,res:Response) => {
  try{
    const result = await pool.query(`SELECT * FROM users`);

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

//single user get
app.get("/users/:id" , async(req:Request,res:Response) => {
  
  try{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[req.params.id])

    if(result.rows.length === 0){
       res.status(404).json({
        success:false,
        message : "User not Found"
       })
    }else {
      res.status(200).json({
        success:true,
        message : "User fetched successfully",
        data : result.rows[0]
      })
    }
  }catch(err:any){
    res.status(500).json({
      success : false,
      message:err.message
    })
  }

})

//update 
app.put("/users/:id",async(req:Request,res:Response) => {
  const {name,email} = req.body
  try{
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name,email,req.params.id]
    );

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

//delete
app.delete("/users/:id" , async(req:Request,res:Response) => {
  
  try{
    const result = await pool.query(`DELETE FROM users WHERE id = $1`,[req.params.id])

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

})





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
