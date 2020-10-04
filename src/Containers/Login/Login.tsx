import React, {FC, useState} from "react";
import {Form, Formik, FormikHelpers} from "formik";
import InputField from "../../Components/InputField";
import * as Yup from "yup";
import LoaderButton from "../../Components/LoaderButton";
import useLogin from "./useLogin";

interface loginFormType {
  email: string
  password: string
}

const loginFormSchema = Yup.object().shape({
  email: Yup.string().email().required().max(255),
  password: Yup.string().required().min(6).max(50)
})

const Login: FC = () => {
  const submitLogin = useLogin()
  const [apiError, setAPIError] = useState("");

  const handleSubmit = async (values: loginFormType, helpers: FormikHelpers<loginFormType>) => {
    const errString = await submitLogin(values)

    if (errString) {
      setAPIError(errString)
    }
  }

  return (
    <div className={"login-wrapper"}>
      <div className="box">
        <h2>Login</h2>
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validationSchema={loginFormSchema}
          onSubmit={handleSubmit}
        >
          {({dirty, isSubmitting}) => {
            return (
              <Form>
                <InputField name={"email"} label={"Email*"}/>
                <InputField type={"password"} name={"password"} label={"Password*"}/>
                {apiError !== "" && <p className={"error-msg"}>{apiError}</p>}
                <LoaderButton type={"submit"} loading={isSubmitting} disabled={!dirty || isSubmitting}>Submit</LoaderButton>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default Login