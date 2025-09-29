interface FormProps {
    children:React.ReactNode;
    className:string;
    submitForm:any
}

export const Form:React.FC<FormProps> = ({ children , className , submitForm }) => {
    return(
        <form onSubmit={submitForm} className={className}>
            {children}
        </form>
    )
}