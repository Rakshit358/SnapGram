import * as z from "zod"

export const SignUpValidation = z.object({
    name: z.string().min(2, {message: "Name too short"}),
    username: z.string().min(2,{message:"Name too short"}),
    email:z.string().email(),
    password:z.string().min(2,{message:"Password must be atleast 8 characters."}),
  })
  
  export const SigninValidation = z.object({
    email:z.string().email(),
    password:z.string().min(2,{message:"Password must be atleast 8 characters."}),
  })
  
  export const PostsValidation = z.object({
    caption: z.string().min(5).max(2200),
    file:z.custom<File[]>(),
    location:z.string().min(2).max(100),
    tags:z.string(),
  })
  