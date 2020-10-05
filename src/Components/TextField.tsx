import React, {FC} from "react";
import {useField} from "formik";

interface propsTypes extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label: string
}

const TextField: FC<propsTypes> = (props) => {
  const [field, meta] = useField(props)
  const showErrMsg = () => {
    return meta.touched && meta.error ? <p className={"error-msg"}>{meta.error}</p> : null
  }

  return(
    <div className={"input-wrapper"}>
      <textarea className={`text-area ${meta.touched && meta.error ? "error" : ""}`} {...field} {...props} placeholder={" "} />
      <label htmlFor={props.name}>{props.label}</label>
      {showErrMsg()}
    </div>
  )
}

export default TextField