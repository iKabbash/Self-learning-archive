const User = require('../model/User');

// don't need them anymore after switching to mongoDB
// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required.'});

    // returns any user that matches
    const duplicate = await User.findOne({ username: user}).exec();
    if (duplicate) return res.status(409); // conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10)
        // 10 salt is standard in case data breach happened
        
        // create AND store the new user
        const result = await User.create ({
            "username": user,
            "password": hashedPwd
            });
            console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!`})
    } catch (err) {
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleNewUser }