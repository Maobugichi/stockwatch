import React, { useState } from 'react'
import { Form } from './form';
import { Input } from './input';
import { Button } from './button';
import { submitCredentials , getValues } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc"; 


type InputFields = {
  username: string;
  email: string;
  password: string;
};


function SignUp() {
  const [ inputValues , setInputValues ] = useState<InputFields>({
    username:"",
    email:"",
    password:""
  });
  
  return (
   <div className='h-screen grid place-items-center font-inter'>
    <Form submitForm={(e:React.FormEvent<HTMLFormElement>) => submitCredentials(e,inputValues)} className='h-[50vh] rounded-2xl border-2 md:h-fit md:py-6 gap-3 flex flex-col w-[90%] items-center justify-center md:w-1/2 space-y-2 mx-auto'>
      <Input type='text' name="username" value={inputValues.username} checkInput={(e:React.ChangeEvent<HTMLInputElement>) => getValues(e,setInputValues)} placeholder='username'/>
      <Input type='email' name="email" value={inputValues.email} checkInput={(e:React.ChangeEvent<HTMLInputElement>) => getValues(e,setInputValues)} placeholder='email'/>
      <Input type='password' name="password" value={inputValues.password} checkInput={(e:React.ChangeEvent<HTMLInputElement>) => getValues(e,setInputValues)} placeholder='password'/>
      <Button type="submit" className='bg-black text-white text-sm md:text-lg h-8 rounded-sm w-[90%] md:w-[90%] md:h-12'>
        Submit
      </Button>

      <div className='bg-white shadow w-[90%] border flex h-7 md:h-8 items-center justify-center gap-2 rounded-sm'>
        <FcGoogle/>
        <Button clicked={() => window.location.href = "http://localhost:3000/oauth/google"} className=''>
            continue with google
        </Button>
      </div>
      <span>Already have an account ?<Link className='text-blue-700 underline' to="/login/">Login</Link></span>
    </Form>
   </div>
  )
}

export default SignUp
