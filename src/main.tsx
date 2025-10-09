import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorPage from "./error-page";
import Root, { HydrateFallback } from "./routes/root";
import { dashLoader, fetchAlerts,  newsLoader, stockLoader, watchListLoader } from "./lib/utils";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./components/ui/dashboard";
import SignUp from "./components/ui/signup";
import Login from "./components/ui/login";
import Notifications from "./components/ui/notifs";
import { ContextProvider } from "./components/context";
import WatchList from "./routes/watchlist";
import StockDetails from "./components/ui/stock-details";
import AlertsList from "./routes/alert-logs";
import  NewsPage from "./routes/news-page";
import Onboarding from "./components/ui/onboarding/onboardingStepper";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Hydrate from "./App";
import StockDashboard from "./routes/trending";

async function initErudaIfDebug() {
  if (localStorage.getItem("debug") === "true") {
    const eruda = await import("eruda");
    eruda.default.init();
    console.log("%c🪄 Debug mode active", "color: lime;");
  }
}


initErudaIfDebug();

const router = createHashRouter([
  {
    path: "/",
    element:<Root/>,
    errorElement:<ErrorPage/>,
    children: [{
        index:true,   
        element: <StockDashboard/>,
        HydrateFallback: HydrateFallback, 
    },
    {
      path:"watchlist",
      element:<WatchList/>,
      loader:watchListLoader,
      errorElement:<ErrorPage/>
    },
    {
      path:"/watchlist/:symbol",
      element:<StockDetails/>,
      loader:stockLoader,
      errorElement:<ErrorPage/>
    },
    {
      path:"news/:category",
      element:<NewsPage/>,
      loader:newsLoader,
      errorElement:<ErrorPage/>
    },
    {
      path:"alerts/:userId",
      element:<AlertsList />,
      loader:fetchAlerts,
      errorElement:<ErrorPage/>
    },
    {
      path:"portfolio",
      element:<Dashboard/>,
      loader:dashLoader,
      errorElement:<ErrorPage/>
    },
  ],
  HydrateFallback:Hydrate
  }
  ,
  {
    path:"/signup/",
    element:<SignUp/>
  },
  {
    path:"login",
    element:<Login/>
  },
  {
    path:"/onboarding/",
    element:<Onboarding/>   
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
     <ContextProvider>
      <RouterProvider router={router} />
       <Notifications/>
       <Toaster position="top-right" richColors closeButton/>
     </ContextProvider>
     </QueryClientProvider>
  </StrictMode>
 
);