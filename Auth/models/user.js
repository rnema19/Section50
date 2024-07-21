const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required : [true,'Username cannot be blank']
    },
    password : {
        type: String,
        required : [true,'Password cannot be blank']
    }
})

userSchema.statics.findAndValidate = async (username,password) => {
    const foundUser = await this.findOne({username})
    const match = await bcrypt.compare(password,foundUser.password)
    return match?foundUser : false
}

module.exports = mongoose.model('User',userSchema)