        //promises method
const asyncHandler = (requestHandler) => {
    (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err))
    }
}



export {asyncHandler}

           //function to function
// const asyncHandler = () => {}
// const asyncHandler = () => () => {}
// const asyncHandler = () => async() => {}


            //try-catch method
// const asyncHandler= (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
        
//     }
// }