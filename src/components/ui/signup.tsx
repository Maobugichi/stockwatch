import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './input';
import { Button } from './button';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      // Your sign up logic here
      console.log("Form data:", data);
      
      //Example: await submitCredentials(data);
      
      // Handle success (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Sign up error:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/oauth/google";
  };

  return (
    <div className='h-screen grid place-items-center font-inter'>
      <div className='h-[50vh] rounded-2xl border-2 md:h-fit md:py-6 gap-3 flex flex-col w-[90%] items-center justify-center md:w-1/2 space-y-2 mx-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4 px-4'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='username'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='email'
                      {...field}
                    />
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
                    <Input
                      type='password'
                      placeholder='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className='bg-black text-white text-sm md:text-lg h-8 rounded-sm w-full md:h-12'
            >
              Submit
            </Button>
          </form>
        </Form>

        <div className='bg-white shadow w-[90%] border flex h-7 md:h-8 items-center justify-center gap-2 rounded-sm'>
          <FcGoogle />
          <Button 
            type="button"
            variant="ghost"
            onClick={handleGoogleAuth} 
            className='h-full'
          >
            Continue with Google
          </Button>
        </div>

        <span className='text-sm'>
          Already have an account? <Link className='text-blue-700 underline' to="/login/">Login</Link>
        </span>
      </div>
    </div>
  )
}

export default SignUp