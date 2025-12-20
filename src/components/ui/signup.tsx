import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './input';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import api from '@/lib/axios-config';
import { useAuth } from '@/hooks/authContext';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Eye, EyeOff } from 'lucide-react';

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/sign-up/`, values);
      console.log(response.data);
      setLoading(false);
      login(response.data);

      toast.success("Signup Successful! 🎉", {
        description: "Welcome to StockWatcher!",
      });
      navigate('/');
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      toast.error("Signup Failed", {
        description: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/oauth/google";
  };

  return (
    <div className='h-screen grid place-items-center font-inter'>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className='h-fit px-6 py-8 rounded-4xl border-2 gap-3 flex flex-col w-[90%] items-center justify-center md:w-[35%] space-y-4 mx-auto'
        >
        
          <div>
            <h1 className="text-3xl font-bold text-center">StockWatcher</h1>
            
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xl">Username</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-3xl placeholder:text-lg tracking-widest"
                    type='text'
                    placeholder='johndoe'
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
              <FormItem className="w-full">
                <FormLabel className="text-xl">Email</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 rounded-3xl placeholder:text-lg tracking-widest"
                    type='email'
                    placeholder='johndoe@gmail.com'
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
              <FormItem className="w-full">
                <FormLabel className="text-xl">Password</FormLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 z-10"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                  <FormControl>
                    <Input
                      className="py-6 rounded-3xl placeholder:text-lg tracking-widest"
                      type={showPassword ? "text" : "password"}
                      placeholder='**********'
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full grid space-y-3">
            <Button 
              type="submit" 
              className={`${loading ? "bg-black/20" : "bg-black"} relative overflow-hidden text-lg tracking-wider text-white h-8 md:h-12 py-5 rounded-3xl w-full`}
            >
              <span className="absolute inset-0 bg-black rounded-3xl" />
              <span className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/20 to-black/0 animate-shimmer" />
              {loading ? (
                <ClipLoader size={20} color="white" className="relative z-10" />
              ) : (
                <span className="relative z-10">Submit</span>
              )}
            </Button>

            <div className='bg-white shadow border text-lg tracking-wider flex items-center justify-center gap-2 h-8 md:h-12 py-5 rounded-3xl w-full'>
              <FcGoogle />
              <Button 
                type="button"
                variant="ghost"
                onClick={handleGoogleAuth} 
              >
                Continue with Google
              </Button>
            </div>
          </div>

          <span className='tracking-wide text-black/70'>
            Already have an account? <Link className='text-blue-700 underline' to="/login/">Login</Link>
          </span>
        </form>
      </Form>
    </div>
  );
}

export default SignUp;