interface InputProps {
    value:string;
    type:string;
    className?:string;
    name:string;
    checkInput:any
    placeholder:string;
    onKeyDown?:any;
    onFocus?:any;
    autoComplete?:string;
    ref?:React.Ref<HTMLInputElement>;
}


export const Input: React.FC<InputProps> = ({ value, type , className , name ,checkInput, placeholder,onKeyDown , onFocus , autoComplete , ref}) => {
    return(<input ref={ref} onChange={checkInput} value={value} type={type} placeholder={placeholder} className={`${className} bg-white h-12 w-[90%] mx-auto border rounded-sm pl-5 focus:outline-blue-400`} name={name} onKeyDown={onKeyDown} onFocus={onFocus} autoComplete={autoComplete}/>)
}
