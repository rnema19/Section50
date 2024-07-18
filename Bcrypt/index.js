const bcrypt = require('bcrypt');

const hashPassword = async(pw) => {
    const salt = await bcrypt.genSalt(20)
    const hash = await bcrypt.hash(pw,salt)
    console.log(salt)
    console.log(hash)
}

const login = async (pw, hashedPw) => {
    //... fetch user from a db etc.

    const match = await bcrypt.compare(pw,hashedPw);
    if(match) {
        console.log("Login attempt successful!!")
    }
    else{
        console.log("INCORRECT PASSWORD!!")
    }
}

// hashPassword('tiger')
login('Tiger','$2b$10$BIkF0m8GLFCEdT9VnmAXQOIc.xUL0XB4vysmWHwrDTR0OY6QJe78C')
