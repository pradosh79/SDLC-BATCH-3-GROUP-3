
const mongoose=require('mongoose')


const dbConnection=async()=>{
    try{
       const isConnected=await mongoose.connect(process.env.MONGODB_URL)
       if(isConnected){
        console.log('mongodb connection successfully');
        
       }else{
        console.log('error');
        
       }

    }catch(error){
        console.log(error);
        
    }
}

module.exports=dbConnection