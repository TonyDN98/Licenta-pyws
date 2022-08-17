// wrap async functions
// func pass in return a new function with  func executed
// and catch  any error and passed to next;
module.exports = func =>{
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}