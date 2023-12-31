const db=require("../model/model")
const user=db.user
const helper=require("../lib/helper")
const jwt=require("../lib/auth")
const hashing=require("../lib/password")
const { date } = require("joi")
//const jwt=require("jsonwebtoken")
//require('dotenv').config();

 async function  signUp(inputdata)  {
    // const {name, email, password,phone_number}=req.body;
    // console.log('req',req.body);
    try{
     const existUser=await user.findOne({where:{email: inputdata.email}})
     if(existUser){
        return {message:"email is already exist"}
     }
      const hash=hashing.encPassword(inputdata.password)
      const token=jwt.tokenGenerator(inputdata.email)

      console.log("token", token);
    //   const newUser=new user(inputdata)
      const newUser = new user({
        name: inputdata.name,
        email: inputdata.email,
        phone_number: inputdata.phone_number,
        password: hash.hash,
        salt: hash.salt,
        token: token.accessToken,
        refresh_Token: token.refreshToken
      });
      var data = await newUser.save();
      return { isSuccess: true, message: "Student Created Successfully!!", data: data };
    }
    catch (error) {
       // console.error('Error saving user:', error);
        return {isSuccess: false, message:"unable to register", error}
      }};
      // another way of login
//        async function signIn(input) {
        
//           try{
            
//             const users=await user.findOne({where:{email:input.email}})
//             console.log("email",users);
//             if (!users) {
//                 return { isSuccess: true, message: 'User not found' };
//             }
//             const passwordMatch = await hashing.decPassword(input.password,  users.password,users.salt);

//                 if (!passwordMatch) {
//                   return res.status(401).json({ error: 'Incorrect password' });
//                 }
//                 const token = jwt.tokenGenerator({ email: input.email });
//                 console.log("token", token.token);
//               return  { isSuccess: true, message:"Login succewssfull!",token:token.accessToken };                
// }
// catch (error) {

//  return {isSuccess: false, message:"unable to login", error}
// }};


async function login( {email, password} ) {
    try {
        
        // console.log("dsssd", authHeader);

        if (!email || !password) {
            return { error: 'Email and password are required' };
        }

        console.log("Email", email);

        const verify = await jwt.tokenGenerator(email);
        console.log("vvvv", verify);

        // if (verify.isSuccess === false) {
        //     return { error: 'Token expired' };
        // }

        // if (verify.email !== email) {
        //     return { error: 'Token mismatch with user' };
        // }

        const userRecord = await user.findOne({ where: { email: email } });
        console.log("User Record:", userRecord);

        if (!userRecord) {
            return { error: 'User not found' };
        }
         userRecord.accessToken=verify.accessToken
         await userRecord.save()
        const passwordMatch = await hashing.decPassword(password, userRecord.password, userRecord.salt);

        if (!passwordMatch) {
            return { error: 'Incorrect password' };
        }

        return { message: "Login successful!" ,data:userRecord};
    } catch (err) {
        console.error(err);
        return { error: 'Internal Server Error'  };
    }
}



// another way of user id using token
//   async function getOneUser(input)  {
//   try{
//   var authHeader = input.headers['authorization'];
//    console.log("dsssd",authHeader);
//    const verify= await jwt.verifyToken(authHeader);
// console.log("vvvv", verify);
// if (verify.isSuccess == false) {
//   return res.status(401).json({ error: 'Token expired' });
// }
// let email=verify.email
//   let details=await user.findOne({where:{email:email}} )
//   console.log("user details",details);
// return res.json({  data:details,message:"login success"})
//   }
//   catch(err)
//   {
//     return res.send(err)
//   }}
async function ForgetPassword(req, res) {
  const { Email } = req.query;

  try {
    const oldUser = await user.findOne({ where: { Email: Email } });

    if (!oldUser) {
      
      return res.json({ isSuccess: false, message: "No user found with that email address!" });
    }

    // Assuming you have a forgetPass model or object, you should define it before using it
    const forgetPass = oldUser; // Replace with your actual forgetPass object or model

    const newPassword = req.body.newpassword;
    const confirmPassword = req.body.confirmpassword;

    if (newPassword !== confirmPassword) {
      return res.json({ isSuccess: false, message: "Password mismatch" });
    }

    // Encrypt the password
    const encPass = hashing.encPassword(newPassword);

    // Update forgetPass with the new password and salt
    forgetPass.password = encPass.hash;
    forgetPass.salt = encPass.salt;

    // Save the changes to the database
    const chgPass = await forgetPass.save();

    return res.json({ isSuccess: true, message: "Password changed successfully!", data: chgPass });
  } catch (err) {
    // Handle any unexpected errors
    console.error(err);
    return res.json({ isSuccess: false, message: "An error occurred while processing your request." });
  }
}

module.exports={signUp:signUp,login:login, ForgetPassword: ForgetPassword/*signIn:signIn,getOneUser:getOneUser*/}