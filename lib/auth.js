const jwt=require("jsonwebtoken")
require('dotenv').config();
function tokenGeneration(inputToken){
    const accessToken=jwt.sign({inputToken},process.env.SECRET_KEY,{expiresIn:'10m'})
    const refreshToken=jwt.sign({inputToken},process.env.SECRET_KEY,{expiresIn:'1d'})
    if(!accessToken&&!refreshToken){
        return res.status(401).json({"error":false,"message": 'Unauthorized access.'})
    }
    return{accessToken,refreshToken}
}

function tokenVerify(authHeader){
    if(!authHeader){
        return authHeader;
    }
    const token=authHeader.split(' ')[1];

    const tokenUser = jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            
            return { isSuccess: false, data: err };
        }
    
        return user.inputToken;
    });

    return tokenUser;
}
module.exports = {
    tokenVerify: tokenVerify,
    tokenGenerator: tokenGeneration
};
