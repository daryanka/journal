import React, {FC} from "react";

interface loaderButtonProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  loading?: boolean
  disabled?: boolean
}

const LoaderButton: FC<loaderButtonProp> = (props) => {
  return (
    <div className={`button-wrapper ${props.loading ? "loading" : ""}`}>
      <button {...props}>
        <span className={`spinner`}>
          <span className="bounce1"></span>
          <span className="bounce2"></span>
          <span className="bounce3"></span>
        </span>
        <span className={"child"}>{props.children}</span>
      </button>
    </div>
  )
}

export default LoaderButton;