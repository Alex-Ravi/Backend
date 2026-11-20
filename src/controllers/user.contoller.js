import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User, user} from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req,res)=>{
    //get user details from frontend
    //check validation-not empty
    //check if already user exist or not: by EMAIL,USERNAME
    //check for images, check for avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

    const {username,fullname,email,password}=req.body
   // console.log("email",email);

    if (
        [username,fullname,email,password].some((field)=>
            field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields are required")
    }

    const existedUser= user.findOne({
        $or: [{ username },{ email }]
    })
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avator[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar files is required")
    }

    const avatar = await UploadOnCloudinary(avatarLocalPath)
    const coverImage = await UploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar files is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(User._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new Error(500,"something went wrong while registering the user")
    }

    return res.status(201).json(
        newApiResponse(200, createdUser,"  User registered succesfully")
    )
} )



export { registerUser }