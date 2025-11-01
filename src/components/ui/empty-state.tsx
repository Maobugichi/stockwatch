import  { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import type { UserChoiceType } from "@/types";
import Holdings from '../holdings';

const EmptyPortfolioState = () => {

    const [ open , setOpen ] = useState<boolean>(false);
    const [ userChoice , setUserChoice ] = useState<UserChoiceType>({
        ticker:"",
        shares:"",
        buyPrice:""
    });
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          {/* Icon illustration */}
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-blue-500" />
            </div>
            <div className="absolute -bottom-1 -left-2 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-2.5 h-2.5 text-green-500" />
            </div>
          </div>

        
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              No Portfolio Holdings Yet
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sorry, you don't have any portfolio holdings at the moment. 
              Start building your investment portfolio by adding your first stock holdings.
            </p>
          </div>

         <Holdings
            header={<button className="flex bg-black text-white p-3 items-center justify-center gap-3"><PlusCircle size={20}/>  <p>Add Portfolio Hodlings</p></button>}
            type="portfolio"
            open={open}
            setOpen={setOpen}
            userChoice={userChoice}
            setUserChoice={setUserChoice}
            
         />

        
          <p className="text-xs text-gray-400">
            Track your investments and monitor performance in real-time
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const MinimalEmptyState = () => {
  
    const [ open , setOpen ] = useState<boolean>(false);
    const [ userChoice , setUserChoice ] = useState<UserChoiceType>({
        ticker:"",
        shares:"",
        buyPrice:""
    });
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Briefcase className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Portfolio Holdings
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Sorry, no portfolio holdings found. Click the button below to add your first holdings.
      </p>
      
      <Holdings
        header={<button className="flex bg-black text-white p-3 items-center justify-center gap-3"><PlusCircle size={20}/>  <p>Add Portfolio Hodlings</p></button>}
        type="portfolio"
        open={open}
        setOpen={setOpen}
        userChoice={userChoice}
        setUserChoice={setUserChoice}
     />
    </div>
  );
};


const FullPageEmptyState = () => {
 
    const [ open , setOpen ] = useState<boolean>(false);
    const [ userChoice , setUserChoice ] = useState<UserChoiceType>({
        ticker:"",
        shares:"",
        buyPrice:""
    });
  return (
    <div className="h-[60%] md:h-[80%] rounded-2xl flex items-center justify-center bg-gray-50 p-6 w-[90%] md:w-1/2 font-inter">
      <div className="max-w-md w-full">
       
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
           
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center" style={{animationDelay: '0.5s'}}>
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

       
        <div className="text-center space-y-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Start Your Investment Journey
          </h1>
          
          <p className="text-gray-600 text-sm md:text-md">
            Sorry, you don't have any portfolio holdings now. 
            Begin tracking your investments and watch your wealth grow.
          </p>
          
          <div className="pt-4">
            <Holdings
            header={<PlusCircle size={20}/> }
            type="portfolio"
            open={open}
            setOpen={setOpen}
            userChoice={userChoice}
            setUserChoice={setUserChoice}
            />
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 pt-4">
            <span className="flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Real-time tracking
            </span>
            <span className="flex items-center">
              <BarChart3 className="w-3 h-3 mr-1" />
              Performance analytics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyPortfolioState;
export { MinimalEmptyState, FullPageEmptyState };