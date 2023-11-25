const express=require("express")
const router=require("./router/router")
const db=require("./model/model")
const app=express()
app.use(express.json())
router.init(app);;
    db.sequelize.sync({ alter: false });


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening Port : " + port);
    // console.log(`Listening Port :  + ${port}`);
});  console.log("port");