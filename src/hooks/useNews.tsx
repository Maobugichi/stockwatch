import { useState , useEffect  } from "react";



const useNews = (getNewsData:any) => {
    const [ news , setNews ] = useState<[]>([])
    const [ loading, setLoading ] = useState<boolean>(true)
    useEffect(() => {
      let isMounted = true;
      console.log(getNewsData)
      async function getNews() {
        const response = await getNewsData;
        console.log(response)
        if (isMounted) {
            setNews(response);
            setLoading(false)
        }
      }
      getNews()

      return () => {
        isMounted = false
      }

      
    },[])

    return { news , loading }
}

export default useNews