import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import api from "@/lib/axios-config";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.email({ message: "Invalid Email address" }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await api.post(`/api/login/`, values);
      console.log(response.data);
      setLoading(false);
      login(response.data);

      toast.success("Login Successful! 🎉", {
        description: "Welcome back! Redirecting you now...",
      });
      navigate('/');
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      toast.error("Login Failed", {
        description: err.response?.data?.message || "Invalid email or password. Please try again.",
      });
    }
  }

  return (
    <div className="h-screen grid place-items-center font-inter">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-fit px-6 py-8 rounded-4xl border-2 gap-3 flex flex-col w-[90%] items-center justify-center md:w-[35%] space-y-4 mx-auto"
        >
        
          <div>
            <h1 className="text-3xl font-bold text-center">StockWatcher</h1>
           
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xl">Email</FormLabel>
                <FormControl>
                  <Input 
                    className="py-6 rounded-3xl placeholder:text-lg tracking-widest" 
                    placeholder="johndoe@gmail.com" 
                    type="email" 
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
                      placeholder="**********" 
                      type={showPassword ? "text" : "password"} 
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
              disabled={loading}
              className={cn(
                "relative overflow-hidden text-lg tracking-wider text-white h-8 md:h-12 py-5 rounded-3xl w-full",
                loading && "!pointer-events-auto cursor-not-allowed"
              )}
            >
              <span className="absolute inset-0 bg-black rounded-3xl pointer-events-none" />
              <span className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/20 to-black/0 animate-shimmer pointer-events-none" />
              {loading ? (
                <ClipLoader size={20} color="white" className="relative z-10 pointer-events-none" />
              ) : (
                <span className="relative z-10 pointer-events-none">Submit</span>
              )}
            </Button>

            <div className="bg-white shadow border text-lg tracking-wider flex items-center justify-center gap-2 h-8 md:h-12 py-5 rounded-3xl w-full">
              <FcGoogle />
              <Button
                type="button"
                variant="ghost"
                onClick={() => (window.location.href = "http://localhost:3000/auth/google")}
              >
                Continue with Google
              </Button>
            </div>
          </div>

          <span className="tracking-wide text-black/70">
            Don't have an account?{" "}
            <Link className="text-blue-700 underline" to="/signup">
              Sign up
            </Link>
          </span>

          <button
            className="text-sm text-gray-500 underline"
            onClick={() => {
              localStorage.setItem("debug", "true");
              location.reload();
            }}
            type="button"
          >
            Enable Debug Mode
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Login;