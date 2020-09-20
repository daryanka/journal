import React, {FC} from "react";
import {FormikProps, useField} from "formik";


interface propsTypes extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
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
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <input {...field} {...props} />
      {showErrMsg()}
    </div>
  )
}

export default InputField