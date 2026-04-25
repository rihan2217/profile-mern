require('dotenv').config()  // ← must be the FIRST line
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./usermodel');

const app = express();

app.use(cors({ origin: 'https://profile-mern-ten.vercel.app/'}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌", err))


app.post('/api/create',async (req,res)=>{
    const {username,email,image} = req.body;
    const user = await UserModel.create({
            username,
            email,
            image
    })
    res.json(user);
})

app.get('/api/read',async (req,res)=>{
    const user = await UserModel.find();
    res.json(user);
})

app.get('/api/edit/:id',async (req,res)=>{
    const user = await UserModel.findById(req.params.id);
    res.json(user);
})

app.post('/api/update/:id',async (req,res)=>{
    const { username, email, image } = req.body;
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { username, email, image },
        { new: true } // returns the updated document
    );
    res.json(user);
})

app.get('/api/delete/:id', async (req,res)=>{
    const user = await UserModel.findOneAndDelete(
        req.params.id
    );
    res.json({message: 'deleted'})
})

app.listen(3000,()=>console.log("server running on port 3000"));