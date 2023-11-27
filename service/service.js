const db=require("../model/model")
const user=db.user
const helper=require("../lib/helper")
const jwt=require("../lib/auth")
const hashing=require("../lib/password")
const  { smtpTransport }=require("../lib/email")
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
async function ForgetPassword(email) {
 

  try {
    const oldUser = await user.findOne({ where: { email: email } });

    if (!oldUser) {
      return res.json({ isSuccess: false, message: "No user found with that email address!" });
    }

    // Assuming you have a template function for generating the email HTML
   // const htmlToSend = template(replacements);
   var mailOptions = {
    to: email,
    from: "mesh@dmarc.com",
    subject: "Welcome to DMARC! Please Change or reset your password.",
    text: "Hello"
};
smtpTransport.sendMail(mailOptions).then(res => {
    console.log("Working", res)
}).catch(err => {
    console.log(err)
})

    // Response for successful email sending
   
    return {isSuccess:true,message:"email send succesfully"};
  } catch (error) {
    console.error(error);
    // Handle the error and return an appropriate response
    
    return {error:"email is not send"};
  }
}
    // If you're in a function where `next` is available, you can call it here
    // return next();

    // Continue with password reset logic

    // Assuming you have a forgetPass model or object, you should define it before using it
    //const forgetPass = oldUser; 
    // Replace with your actual forgetPass object or model

    // if (newpassword !== confirmpassword) {
    //   return res.json({ isSuccess: false, message: "Password mismatch" });
    // }

    // Encrypt the password
//     const encPass = hashing.encPassword(newpassword);

//     // Update forgetPass with the new password and salt
//     forgetPass.password = encPass.hash;
//     forgetPass.salt = encPass.salt;

//     // Save the changes to the database
//     const chgPass = await forgetPass.save();

//     return res.json({ isSuccess: true, message: "Password changed successfully!", data: chgPass });
//   } catch (err) {
//     // Handle any unexpected errors
//     console.error(err);
//     return res.json({ isSuccess: false, message: "An error occurred while processing your request." });
//   }
// }
async function ResetPassword(req,res) {
  const inputdata=req.query;
  const resetPass=req.body;
  console.log("dfdgg",inputdata);
  console.log("efed",resetPass);
  try {
      const passUpdate = await user.findOne({where:{ email: inputdata.email }});
      console.log("dfdg",passUpdate.dataValues)
      //DB PASSWORD
      const requiredPassword = passUpdate.dataValues.password;
      const requiredSalt = passUpdate.dataValues.salt;
//console.log("paas",requiredPassword)
//console.log("salt",requiredSalt);
      //INPUT PASSWORD
      const oldPassword = inputdata.oldpassword;
    
      const newPassword = resetPass.newpassword;
      const confirmPassword = resetPass.confirmpassword;
      console.log("new",newPassword);
      console.log("confirm",confirmPassword);
      if (newPassword != confirmPassword) {
       return res.status(200).json({ message:"New password mismatch with Confirm password" });
      
          
      }
    //DECRYPT PASSWORD
      const verifyPassword = hash.decryptPassword(oldPassword, requiredPassword, requiredSalt);
console.log("verify",verifyPassword);
      //ENCRYPT PASSWORD
      if (verifyPassword) {
          const encPass = hash.encryptPassword(newPassword);
console.log("enc",encPass);
          passUpdate.dataValues.password = encPass.hash;
          passUpdate.dataValues.salt = encPass.salt;

          const saveUpdatedPass = await passUpdate.save();
          console.log("save",saveUpdatedPass);
          return res.status(200).json( { isSuccess: true, message: "Password Updated Successfully", data: saveUpdatedPass })
      }
      return { isSuccess: false, message: "Unable to reset password" }
  } catch (err) {
      return { isSuccess: false, message: "Unable to access" }
  }
}
async function LogOutUser(req, res) {
  debugger;

  try {
    const outUser = await user.findOne({ where: { id: req.params.id } });
    
    if (!outUser) {
      return res.json({ message: "User does not exist!" });
    }

    outUser.token = null;
    outUser.refreshtoken = null;

    var data = await outUser.save();
    console.log("out", data);
    
    return res.json({ message: "Logout Successfully!", data: data });
  } catch (err) {
    console.log("err", err);
    return res.json({ message: "Unable to Logout!" });
  }
}


module.exports={signUp:signUp,login:login, ForgetPassword: ForgetPassword,LogOutUser:LogOutUser,ResetPassword:ResetPassword/*signIn:signIn,getOneUser:getOneUser*/}