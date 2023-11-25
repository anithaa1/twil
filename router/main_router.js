const express = require('express');
const router = express.Router();



 const controller=require("../controller/controller")
 router.use("/newuser", controller);


module.exports = router;
