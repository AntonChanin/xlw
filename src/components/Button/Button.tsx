export function Button({ onClick: handleClick, children }:
    { onClick: () => void;  children?: React.ReactNode; }) {
   return <button onClick={() => handleClick()}>{children}</button> 
}

export default Button;
