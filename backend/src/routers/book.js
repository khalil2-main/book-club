const { Router}= require('express')

const router=Router();


router.get('/',(req,res)=>{
  return res.status(200).send('book router work')
})



module.exports=router