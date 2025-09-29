import { useRouteError , isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();

    return(
        <div>
            <h1>Oops</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{isRouteErrorResponse(error)
                ? error.statusText : error instanceof Error
                ? error.message : "Unknown Error"}</i>
            </p>
        </div>
    )
}

export default ErrorPage