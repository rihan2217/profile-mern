const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    user: 
        {
            type : mongoose.Schema.Types.ObjectId,ref: 'user',
        },
    image: {type :String,default: ''},
    date:{ type: Date , default: Date.now()},
    content:String,
    likes:[
        {
            type : mongoose.Schema.Types.ObjectId,ref: 'user',
        }
    ],
    
},
{
    timestamps: true,  // ✅ adds createdAt & updatedAt automatically
  }
)

module.exports = mongoose.model("post", PostSchema);