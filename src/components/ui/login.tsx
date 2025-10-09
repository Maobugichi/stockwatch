import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "./form";
import { Input } from "./input";
import { getLoginDetails } from "@/lib/utils";
import { Button } from "./button";
import { ClipLoader } from "react-spinners";
import { useLogin } from "@/hooks/useLogin";

type UserDataType = {
    email: string,
    password: string
}

const Login = () => {
    const navigate = useNavigate();
    const { mutateAsync: login, isPending, isError, error } = useLogin();

    const [userData, setUserData] = useState<UserDataType>({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🚀 Form submitted');
        
        try {
            console.log('🔄 Calling login...');
            const result = await login(userData);
            
            console.log('✅ Login result:', result);
            console.log('🔍 Onboarded status:', result?.onboarded);
            
            // Navigate based on onboarding status
            const targetPath = result?.onboarded ? '/' : '/onboarding';
            console.log('🎯 Target path:', targetPath);
            
            // Try navigate
            console.log('🧭 Attempting navigate...');
            navigate(targetPath, { replace: true });
            console.log('✅ Navigate called');
            
            // Fallback: if navigate doesn't work, force hash change
            setTimeout(() => {
                console.log('⏱️ Checking if navigation happened...');
                console.log('Current hash:', window.location.hash);
                const expectedHash = `#${targetPath}`;
                
                if (window.location.hash !== expectedHash) {
                    console.log('⚠️ Navigate failed, forcing hash change');
                    window.location.hash = targetPath;
                    
                    // If still not working after another delay, reload
                    setTimeout(() => {
                        if (window.location.hash !== expectedHash) {
                            console.log('🔥 Nuclear option: reloading');
                            window.location.reload();
                        }
                    }, 500);
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Login failed:', error);
        }
    }

    return (
        <div className="h-screen grid place-items-center font-inter">
            <Form className="rounded-2xl border-2 h-fit py-10 gap-3 flex flex-col w-[90%] items-center justify-center md:w-1/2 space-y-2 mx-auto" submitForm={handleSubmit}>
                <Input 
                    name="email" 
                    type="text" 
                    value={userData.email} 
                    placeholder="Enter your email" 
                    checkInput={(e: React.ChangeEvent<HTMLInputElement>) => getLoginDetails(e, setUserData)}
                />
                <Input 
                    name="password" 
                    type="password" 
                    value={userData.password} 
                    placeholder="Enter your password" 
                    checkInput={(e: React.ChangeEvent<HTMLInputElement>) => getLoginDetails(e, setUserData)}
                />
                <Button 
                    type="submit"
                    className="md:self-start md:ml-8 bg-black text-white text-sm h-12 font-bold rounded-sm w-[90%] md:w-[15%] md:h-12"
                    disabled={isPending}
                >
                    {isPending ? <ClipLoader color="#fff" size={20} /> : 'Submit'} 
                </Button>
                <button 
                    className="bg-black text-white px-4 py-2 rounded" 
                    onClick={() => {
                        localStorage.setItem("debug", "true");
                        location.reload();
                    }}
                    type="button"
                >
                    Enable Debug Mode
                </button>
                {isError && <p style={{ color: "red" }}>{(error as any).message}</p>}
                <span> Don't have an Account? <Link className="text-blue-500 underline" to="/signup">Sign up</Link></span>
            </Form>
        </div>
    )
}

export default Login