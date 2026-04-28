const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: {type:String,default: ''},
    post:[
        {
            type : mongoose.Schema.Types.ObjectId,ref: 'post',
        }
    ],
    
},
{
    timestamps: true,  // ✅ adds createdAt & updatedAt automatically
  }
)

module.exports = mongoose.model("user", UserSchema);