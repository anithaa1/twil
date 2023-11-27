const express= require("express")
 const router=express.Router()
const joiValid=require("../valid/joi_valid")
const service=require("../service/service");

const helper = require("../lib/helper");
router.post('/signup', async (req, res) => {   
    const {error, value} = joiValid.validate(req.body);
    if (error) {
        return res.status(400).json({
            isSuccess: false,
            message: 'Invalid Request',
            data: error
        });
    }
    // console.log("EEEEEEE", error);
     console.log("VVVVVVV", value);
    if(value){
    try {

        var inputdata = req.body;
        console.log("eff",inputdata);
        var newResult = await service.signUp(inputdata);
        // console.log("ffff",newResult);
        return helper.SendResponse(res, newResult);
    }
    catch (err) {
        return helper.SendErrorResponse(err, res);
    }
}
});
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Request Body:", req.body);

        const newResult = await service.login({ email, password});

        console.log("Result:", newResult);

        return helper.SendResponse(res, newResult);
    } catch (err) {
        return helper.SendErrorResponse(err, res);
    }
});
router.post('/forget', async(req, res) =>{
    const { email } = req.body;
  
    try {
      const result = await service.ForgetPassword(email);
      return helper.SendResponse(res, result);
    } catch (err) {
      console.error(err);
      return helper.SendErrorResponse(err, res);
    }
  })
  router.post('/signout',async(req,res)=>{
    const{id}=req.params.id;
    try{
        const result =await service.LogOutUser(id)
        return helper.SendResponse(res,result);
    }
    catch(err){
        console.error(err)
        return helper.SendErrorResponse(res,500,"something went wrong")
    }
    
  })
// router.get('/getUser',async(req,res)=>{
//     try {
//          var input = req.headers;
// console.log("input",input);
//         var result = await service.getOneUser(input)
//         console.log("ggg",result);
//         return helper.SendResponse(res, result);
//     }
//     catch (err) {
//         return helper.SendErrorResponse(err, res);
//     }
// })

module.exports=router