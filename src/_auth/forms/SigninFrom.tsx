import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {z} from "zod"
import {Link,useNavigate} from "react-router-dom"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/Validation"
import Loader from "@/components/ui/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { setEngine } from "crypto"
import { useUserContext } from "@/context/authContext"

const SignInForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const {checkAuthUser,isLoading:isUserLoading} = useUserContext();
    const {mutateAsync:createUserAccount,isPending: isCreatingUser} = useCreateUserAccount();
    const {mutateAsync:signInAccount,isPending:isSigningIn} = useSignInAccount();
    const form = useForm<z.infer<typeof SigninValidation>>({
      resolver: zodResolver(SigninValidation),
      defaultValues: {
        email:"",
        password:"",
      },
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        const session = await signInAccount({
          email: values.email,
          password: values.password,
        })

        if(!session)
          {
            return toast({title:"Sign in failed.Please try again later."})
          }
        const isLoggedIn = await checkAuthUser();
        
        if(isLoggedIn)
        {
          form.reset();
          navigate('/')
        }else{
          return toast({title:'Sign up failed.Please try again.'})
        }
      }
 
 
      return (

     <Form {...form}>
      <div>
         <img className="sm:w-420 flex-center flex-col" src="/assets/images/logo.svg"/>
         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 flex-center">Welcome back</h2>
         <p className="text-light-3 small-medium md:base-regular mt-2 flex-center">Please enter your email and password</p>
      


      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="Password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary">
          {isCreatingUser ? (<div className="flex-center gap-2">
           <Loader /> Loading...
          </div>):"Login" }
        </Button>
        <p className="text-small-regular text-light-2 text-center ">
         New User ?
        <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign-up</Link>
       </p>
      </form>
      </div>  
    </Form>
  )
}

export default SignInForm