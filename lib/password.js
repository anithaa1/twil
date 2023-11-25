const crypto = require('crypto');
function EncPassword(password) {
    try {
        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return { salt: salt, hash: hash, password: password };
    }
    catch (ex) {
        return '';
    }
}

function DecPassword(password, oldPassword, salt) {
    try{

        let hash = crypto.pbkdf2Sync(password.toString(), salt, 1000, 64, `sha512`).toString(`hex`);     
        if(hash === oldPassword){
            return true;
        }
        return false;
    }
    catch(ex){   
        console.log(ex)     
        return '';
    }
}
module.exports = {
    encPassword : EncPassword,
    decPassword : DecPassword}