import React, {FC} from "react";

interface loaderButtonProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  loading?: boolean
  disabled?: boolean
}

const LoaderButton: FC<loaderButtonProp> = ({loading, children,...props}) => {
  return (
    <div className={`button-wrapper ${loading ? "loading" : ""}`}>
      <button {...props}>
        <span className={`spinner`}>
          <span className="bounce1" />
          <span className="bounce2" />
          <span className="bounce3" />
        </span>
        <span className={"child"}>{children}</span>
      </button>
    </div>
  )
}

export default LoaderButton;