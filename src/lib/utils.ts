import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

import type { SetStateAction } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import type React from "react";
import type { UserDetails } from "@/types";
import api from "./axios-config";


type InputFields = {
  username: string;
  email: string;
  password: string;
};

type SearchTicker = any[];

type UserChoiceType = {
    ticker:string,
    shares:string,
    buyPrice:string
}


const backendEndpoint = import.meta.env.VITE_API_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getValues(e:React.ChangeEvent<HTMLInputElement>,setInputValues:React.Dispatch<React.SetStateAction<InputFields>>) {
  const target = e.currentTarget;
  const { name, value } = target;
  setInputValues((prev:any) => {
    return{
      ...prev,
      [name]:value
    }
  })
}


async function submitCredentials(e:React.FormEvent<HTMLFormElement>,userData:InputFields) {
    e.preventDefault();
    const { username , email , password } = userData;
    if (username == "" || email == "" || password == "") return;
    try {
        const response = await axios.post(`${backendEndpoint}/sign-up/`, userData , {
        withCredentials:true,
        headers: {
        "Content-Type": "application/json",
       },
       })
      return response.data;
    } catch(err) {
      console.log(err)
    }

}



async function stockLoader({params, request}:LoaderFunctionArgs)  {
  const { symbol  } = params;

  try {
    if (!symbol) {
      throw new Response("Stock symbol is required", { status:400 })
    }

    const url = new URL(request.url);
    const period1 = url.searchParams.get("period1");
    const period2 = url.searchParams.get("period2");
    const interval = url.searchParams.get("interval");

    const res = await api.get(`/api/stocks/${params.symbol}`,{
      params: { period1, period2, interval },
    });
    if (!res.data) throw new Error("Failed to load stock data");
    return res.data
  } catch(err) {
    console.log(err)
  }
  
  
}



const getTicker = async(q:string,setOptions:React.Dispatch<SetStateAction<SearchTicker>>) => {
  try {
      const res:any = await axios.get(`${backendEndpoint}/ticker/${q}`,{
        withCredentials:true
      });
      setOptions(res.data);
  } catch(err) {
    console.log(err)
  }
}

const handleUserChoice = (e:React.ChangeEvent<HTMLInputElement>, setUserChoice:React.Dispatch<SetStateAction<UserChoiceType>>) => {
  const target = e.currentTarget;
  const { name , value } = target;

  setUserChoice((prev) => ({
    ...prev,
    [name]:value
  }));
}

const getLoginDetails = (e:React.ChangeEvent<HTMLInputElement>, setUserDetails:React.Dispatch<SetStateAction<UserDetails>>) => {
  const target = e.currentTarget;
  const { name , value } = target;
  setUserDetails((prev) => ({
    ...prev,
    [name]:value
  }))
};

const submitPortfolio = async (e:React.FormEvent<HTMLFormElement>,userChoice:UserChoiceType,userId:number,setUserChoice:React.Dispatch<SetStateAction<UserChoiceType>>,setOpen:React.Dispatch<SetStateAction<boolean>>,setQuery:React.Dispatch<SetStateAction<string>>) => {
  e.preventDefault();
  try {
      const response = await axios.post(`${backendEndpoint}/save-port/${userId}`, userChoice , {
        withCredentials:true
      });
      setQuery("")
      setUserChoice({
        ticker:"",
        shares:"",
        buyPrice:""
      })
      setTimeout(() => {
        setOpen(false)
      }, 3000);
      return response.data

  } catch(err) {
    console.log(err);
  }
}

const dashLoader = async () => {
  let userId
  const userData = localStorage.getItem("user-data");
  if (userData) {
    const parsedData = JSON.parse(userData);
    userId = parsedData.userId;
  }
  try {
    const response = await api.get(`/api/portfolio/${userId}`);
    localStorage.setItem("dashInfo",JSON.stringify(response.data))
    return response.data
  } catch(err) {
    console.log(err)
  }
}

const addToWatchList = async (e:React.FormEvent<HTMLFormElement>,userChoice:any,userId:number,setUserChoice:React.Dispatch<SetStateAction<any>>,setOpen:React.Dispatch<SetStateAction<boolean>>,setQuery:React.Dispatch<SetStateAction<string>>,setNotification: React.Dispatch<SetStateAction<string>>) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${backendEndpoint}/watchlist/add/${userId}`, {ticker:userChoice.ticker} , {
      withCredentials:true
    });
    setQuery("");
    setUserChoice({
      ticker:"",
      shares:"",
      buyPrice:""
    });
    setOpen(false)
    setNotification("watchlist-updated");
    return response.data
  } catch(err) {
    console.log(err)
  }
}

const watchListLoader = async () => {
  try {
    
    const response = await api.get(`/api/getList`);
    console.log(response)
    return response.data
  } catch(err) {
    console.log(err)
    throw err;
  }
}

function formatNumber(value: number): string {
  if (value == null || isNaN(value)) return "N/A";
  if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(1) + "T";
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toString();
}

const getNewsData = async (param:string) => {
  
  const response = await axios.get(`${backendEndpoint}/news/${param}`, {
    withCredentials:true
  });
  
  return response.data
} 

const fetchTrendingNews = async () => {
  try {
    const response = await axios.get(`${backendEndpoint}/trending-news/`, {
      withCredentials:true
    });
    
    return response.data
  } catch(err) {
    console.log(err)
    throw err
  } 
}

 const handleAlerts = async (e:React.FormEvent<HTMLFormElement>,symbol:string,conditions:any,setSymbol:React.Dispatch<SetStateAction<string>>,setConditions:React.Dispatch<SetStateAction<any>>,setNotification: React.Dispatch<SetStateAction<string>>) => {
    e.preventDefault();
   
    let userId
    const userData = localStorage.getItem("user-data");
    if (userData) {
      userId = JSON.parse(userData).userId
    }       

    try {
       await axios.post(`${backendEndpoint}/alerts/${userId}` , {
        symbol,
        conditions:conditions.map((c:any) => ({
          condition_type:c.type,
          value:parseFloat(c.value)
        }))
      }, {withCredentials:true});
      setNotification("alert-created");
      setSymbol("")
      setConditions([{type:"price_above" , value:""}])
    } catch(err) {
      console.log(err)
      throw new Error()
    }
 }

 const fetchAlerts = async ({params}:LoaderFunctionArgs) => {
     const { userId } = params
      try {
        const { data } = await axios.get(`${backendEndpoint}/alerts/${userId}`,{ withCredentials: true})
        return data
      } catch (err) {
        console.error(err)
      } 
 }

  async function submitChanges(e:React.FormEvent<HTMLFormElement>,editingAlert:any,setSaving:React.Dispatch<SetStateAction<boolean>>,formData:any,setEditingAlert:React.Dispatch<SetStateAction<any>>) {
    e.preventDefault();
    let userId
     const userData = localStorage.getItem("user-data");
     if (userData) {
        userId = JSON.parse(userData).userId
      }

    if (!editingAlert) return
    setSaving(true);
    try {
      await axios.patch(`${backendEndpoint}/alerts/${userId}/${editingAlert.alert_id}`,formData,{withCredentials:true});
      window.location.reload();
    } catch(err) {
      console.log(err)
    } finally {
      setSaving(false);
      setEditingAlert(null)
    }
  }


  const getTimeWeight = (publishedTime: string): number => {
  if (!publishedTime) return 1.0;
  
  const now = new Date();
  let articleTime: Date;
  
  
  if (publishedTime.includes('ago')) {
    const hours = publishedTime.match(/(\d+)\s*hour/);
    const days = publishedTime.match(/(\d+)\s*day/);
    const minutes = publishedTime.match(/(\d+)\s*minute/);
    
    if (minutes) {
      articleTime = new Date(now.getTime() - parseInt(minutes[1]) * 60 * 1000);
    } else if (hours) {
      articleTime = new Date(now.getTime() - parseInt(hours[1]) * 60 * 60 * 1000);
    } else if (days) {
      articleTime = new Date(now.getTime() - parseInt(days[1]) * 24 * 60 * 60 * 1000);
    } else {
      return 1.0;
    }
  } else {
    articleTime = new Date(publishedTime);
  }
  
  const hoursDiff = (now.getTime() - articleTime.getTime()) / (1000 * 60 * 60);

  if (hoursDiff <= 1) return 1.3;
  if (hoursDiff <= 6) return 1.2;
  if (hoursDiff <= 12) return 1.1;
  if (hoursDiff <= 24) return 1.0;
  return Math.max(0.8, 1.0 - (hoursDiff - 24) * 0.01);
};

const handleAnalyze = async (
  setAnalyzing: React.Dispatch<SetStateAction<boolean>>,
  setSentiment: any,
  article: any,
  marketContext: string = 'neutral'
) => {
  try {
    setAnalyzing(true);
    
    const timeWeight = getTimeWeight(article.publishedAt || article.relativeTime);
    
    const res = await axios.post(
      `${backendEndpoint}/analyze-sentiment`,
      {
        text: article.title + " " + (article.summary || ""),
        marketContext: marketContext,
        timeWeight: timeWeight
      },
      { withCredentials: true }
    );
    
    console.log('Enhanced sentiment analysis:', res.data);
    setSentiment(res.data);
  } catch (err) {
    console.error("Sentiment analysis failed", err);
  } finally {
    setAnalyzing(false);
  }
};

  function resolveCssVar(variable: string) {
     return getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();
  }

 const newsLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "trending"; 
  const category = url.searchParams.get("category");      
  const symbol = url.searchParams.get("symbol");           
  const range = url.searchParams.get("range") || "7d";     

  let endpoint = "";

if (type === "trending") {
  endpoint = `${backendEndpoint}/newsList/category?category=general`;
} else if (type === "category" && category) {
  endpoint = `${backendEndpoint}/newsList/category?category=${category}`;
} else if (type === "company" && symbol) {
  const to = Math.floor(Date.now() / 1000);
  let from = to - 7 * 24 * 60 * 60;
  if (range === "1d") from = to - 1 * 24 * 60 * 60;
  if (range === "30d") from = to - 30 * 24 * 60 * 60;

  endpoint = `${backendEndpoint}/newsList/company-news/${symbol}?from=${from}&to=${to}`;
}

  const response = await axios.get(endpoint, { withCredentials: true });
  return response.data;
};


const fetchUser = async (setUser:React.Dispatch<SetStateAction<any>> , setCurrentStep:React.Dispatch<SetStateAction<any>>,steps:any) => {
      try {
        const res = await axios.get(`${backendEndpoint}/onboarding/me`, {withCredentials:true})
        const u = res.data[0]
        setUser(u)

        if (u.onboarded) {
          setCurrentStep(steps.length - 1) 
        } else {
          setCurrentStep(u.onboarding_step || 0)
        }
      } catch (err) {
        console.error(err)
      }
  }

  const next = async (data:any, setFormData:React.Dispatch<SetStateAction<any>>, currentStep:any,steps:any,user:any , setCurrentStep:React.Dispatch<SetStateAction<any>> , formData:any) => {
      const updatedFormData = { ...formData, ...data };
      setFormData(updatedFormData);
  
       const isLastFormStep = currentStep === steps.length - 2;
      
      if (!isLastFormStep) {
        
        await axios.post(`${backendEndpoint}/onboarding/step`, { step: currentStep + 1 },{ withCredentials:true})
        setCurrentStep((prev:any) => prev + 1)
      } else {
        console.log("hello")
        await axios.post(`${backendEndpoint}/onboarding`, {
          userId: user.id,
          ...updatedFormData
        },{withCredentials:true})
        await axios.post(`${backendEndpoint}/onboarding/complete`,{},{withCredentials:true})
        setCurrentStep(steps.length - 1)
      }
  }

  const fetchTrending = async () => {
      try {
        const res = await axios.get(`${backendEndpoint}/trending-stock`, { withCredentials: true });
      
        const data = res.data;
        return data
      } catch (err) {
        console.error(err);
      } 
    };

    
    const formatCurrency = (value:any, currency = 'USD') => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };


  const formatMarketCap = (value:any) => {
    if (!value) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  
  const formatVolume = (value:any) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString();
  };

  


  const getChangeColor = (change:any) => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

   

  
  
export { submitCredentials , getValues ,  getTicker , handleUserChoice , getLoginDetails , submitPortfolio , dashLoader , addToWatchList, watchListLoader , stockLoader , formatNumber, getNewsData , fetchTrendingNews , handleAlerts , fetchAlerts , submitChanges , handleAnalyze , resolveCssVar , newsLoader , fetchUser , next , fetchTrending , formatCurrency , formatMarketCap , formatVolume , getChangeColor }

