const jwt =require('jsonwebtoken');
 const authmiddleware =(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
         if(!token){
            return res.status(401).json({message:'未提供token'})
         }

         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         req.user = decoded;
         next();
    } catch (error){
        return res.status(401).json({message:'token无效'})
    }
 };

 module.exports= authmiddleware;