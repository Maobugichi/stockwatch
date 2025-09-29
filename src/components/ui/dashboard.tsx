import { useLoaderData } from "react-router-dom";
import PortfolioDashboard from "@/routes/portfolio";


const Dashboard = () => {
   const data = useLoaderData();
   let parsedData
   const savedData = localStorage.getItem("dashInfo")
   if (savedData) parsedData = JSON.parse(savedData)
    return(
        <>
          <PortfolioDashboard data={data ? data : parsedData}/>
        </>
    )
}

export default Dashboard