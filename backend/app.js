require('dotenv').config()  // ← must be the FIRST line
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const usermodel = require('./usermodel');

const app = express();

app.use(cors({ origin: 'https://profile-mern-ten.vercel.app/', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌", err))


app.post('/api/create',async (req,res)=>{
    const {username,email,password,image} = req.body;

    const existing = await usermodel.findOne({email});
    if(existing) return res.status(400).json({message :"email already exist"});
    
    // hash password
   const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            image
    })

    const token = jwt.sign({id:user._id, email: user.email},process.env.JWT_SECRET,{ expiresIn : '7d'});

    res.cookie('token' , token,{
        httpOnly: true,
        secure: true,
        maxAge: 7*24*60*60*1000
    })

    res.json({ message: "Registered successfully", user });

})

// ✅ MIDDLEWARE - protect routes
function isLoggedIn(req,res,next){
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ message: "Not logged in "});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({ message: "Not logged in "});
    }
}


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // find user
    const user = await UserModel.findOne({ email });
    if(!user) return res.status(400).json({ message: "User not found" });
    
    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Wrong password" });
    
    // create token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // save token in cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Logged in successfully", user });
});

app.get('/api/me', isLoggedIn, (req, res) => {
    res.json({ user: req.user });
});

app.get('/api/read',async (req,res)=>{
    const user = await UserModel.find();
    res.json(user);
})

app.get('/api/edit/:id',async (req,res)=>{
    const user = await UserModel.findById(req.params.id);
    res.json(user);
})

app.post('/api/update/:id', isLoggedIn , async (req,res)=>{

    if(req.user.id !==req.params.id){
        return res.status(403).json({message : "you can only edit your own profile"});
    }
    const { username, email, image } = req.body;
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { username, email, image },
        { new: true } // returns the updated document
    );
    res.json(user);
})

app.get('/api/delete/:id',isLoggedIn, async (req,res)=>{

    if(req.user.id !== req.params.id){
        return res.status(403).json({message:"you can only delete your own profile"});
    }

    const user = await UserModel.findOneAndDelete(
        req.params.id
    );
    res.json({message: 'deleted'})
})

app.listen(3000,()=>console.log("server running on port 3000"));