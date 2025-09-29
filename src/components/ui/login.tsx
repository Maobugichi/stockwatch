import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "./form";
import { Input } from "./input";
import { getLoginDetails, login } from "@/lib/utils";
import { Button } from "./button";
import { ClipLoader } from "react-spinners";


type UserDataType = {
    email:string,
    password:string
}

const Login = () => {
    const [ userData , setUserData ] = useState<UserDataType>({
        email:"",
        password:""
    });
    const navigate = useNavigate();
    const [ loading , setLoading ] = useState<boolean>(false)

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        setLoading(true);

        const response = await login(e,userData);
       
      
        if (response.status == 200) {
            const user = response;
            localStorage.setItem("user-data",JSON.stringify(response))
            if (!user.onboarded) {
             navigate("/onboarding");
            } else {
             setLoading(false) 
             navigate("/");
             
            }
            
        } 
       
    }

    return(
        <div className="h-screen grid place-items-center font-inter">
            <Form className=" rounded-2xl border-2 h-fit py-10 gap-3 flex flex-col w-[90%] items-center justify-center md:w-1/2 space-y-2 mx-auto" submitForm={handleSubmit}>
                <Input name="email" type="text" value={userData.email} placeholder="Enter your email" checkInput={(e:React.ChangeEvent<HTMLInputElement>) => getLoginDetails(e,setUserData)}/>
                <Input name="password" type="password" value={userData.password} placeholder="Enter your password" checkInput={(e:React.ChangeEvent<HTMLInputElement>) => getLoginDetails(e,setUserData)}/>
                    <Button 
                    type="submit"
                    className="md:self-start md:ml-8 bg-black text-white text-sm h-12 font-bold rounded-sm w-[90%] md:w-[15%] md:h-12"
                    >
                  
                   {loading ? <ClipLoader color="#fff" size={20} /> : 'Submit'} 
                    </Button>
                    <span> Dont have an Account?  <Link className=" text-blue-500 underline" to="/signup">Sign up</Link></span>
            </Form>
        </div>
    )
}

export default Login