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
        console.log("Req body:", req.body);

        const newResult = await service.login({ email, password});

        console.log("Result:", newResult);

        return helper.SendResponse(res, newResult);
    } catch (err) {
        return helper.SendErrorResponse(err, res);
    }
});
router.post('/forget', async(req, res) =>{
    const { Email } = req.query;
  
    try {
      const result = await service.ForgetPassword(Email, req.body.newpassword, req.body.confirmpassword);
      return helper.SendResponse(res, result);
    } catch (err) {
      console.error(err);
      return helper.SendErrorResponse(res, 500, "An error occurred while processing your request.");
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