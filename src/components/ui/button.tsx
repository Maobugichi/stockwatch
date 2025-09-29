interface ButtonProps {
    children:any;
    className:string;
    type?:"submit" | undefined;
    clicked?:() => void
    disabled?:boolean
}

export const Button:React.FC<ButtonProps> = ({ children , className , type , clicked , disabled=false}) => {
    return(
        <button onClick={clicked} type={type} className={`${className}`} disabled={disabled}>{children}</button>
    )
}