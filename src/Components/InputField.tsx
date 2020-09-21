import React, {FC} from "react";
import {FormikProps, useField} from "formik";
import _ from "lodash";


interface propsTypes extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  customError?: string
}

const InputField: FC<propsTypes> = (props) => {
  const [field, meta] = useField(props)
  const showErrMsg = () => {
    if (props.customError) {
      return <p className={"error-msg"}>{props.customError}</p>
    }

    return meta.touched && meta.error ? <p className={"error-msg"}>{meta.error}</p> : null
  }

  return(
    <div className={"input-wrapper"}>
      <input className={`${meta.touched && meta.error ? "error" : ""}`} {...field} {...props} placeholder={" "} />
      <label htmlFor={props.name}>{props.label}</label>
      {showErrMsg()}
    </div>
  )
}

export default InputField