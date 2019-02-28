const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

exports.register = async (uName, pWord) => {
    try {
        let hashword = bcrypt.hashSync(pWord, 10);
        let userCreation = await db.postUser(uName, hashword);
        return userCreation;
    } catch (error) {
        return false;
    }
};

exports.signIn = async (uName, pWord) => {
    let user = await db.getUserByUserName(uName);
    if (user) {
        let pWordComparison = bcrypt.compareSync(pWord, user[0].password);
        if (pWordComparison) {
            let tokenObj = { token: jwt.sign({ username: user[0].username, id: user[0].id }, 'catsinabag', { expiresIn: "4h" }) };
            return tokenObj;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
