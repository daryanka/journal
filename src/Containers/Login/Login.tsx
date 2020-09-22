import React, {FC, useState} from "react";
import {Form, Formik, FormikHelpers} from "formik";
import InputField from "../../Components/InputField";
import * as Yup from "yup";
import LoaderButton from "../../Components/LoaderButton";
import {useMutation, useQuery} from "react-query";
import {loginQuery} from "./queries";
import {ErrorType} from "../../ErrorTypes";
import functions from "../../functions";
import Cookie from "js-cookie";
import {useDispatch} from "react-redux";

interface loginFormType {
  email: string
  password: string
}

const loginFormSchema = Yup.object().shape({
  email: Yup.string().email().required().max(255),
  password: Yup.string().required().min(6).max(50)
})

interface SuccessResponse {
  token: string
  expires: number
  expires_in: number
}

const Login: FC = () => {
  const dispatch = useDispatch();
  const [apiError, setAPIError] = useState("");

  const handleSubmit = async (values: loginFormType, helpers: FormikHelpers<loginFormType>) => {
    const res = await functions.post("/auth/login", data)
    if (!res) {
      return setAPIError("server error")
    }

    if (res!.status != 200) {
      const err = res.data as ErrorType
      setAPIError(err.message)
    } else {
      // Change expires_in (minutes to day conversion)
      const expiresIn = (1 / 86400) * 3600
      // Add cookie
      Cookie.set("token", data.data.token, {
        expires: 0.5
      })

      // Get ME
      const res = await functions.post("/auth/me")

      setAPIError("")
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
          {({dirty, isValid, isSubmitting}) => {
            return (
              <Form>
                <InputField name={"email"} label={"Email*"}/>
                <InputField type={"password"} name={"password"} label={"Password*"}/>
                {apiError !== "" && <p className={"error-msg"}>{apiError}</p>}
                <LoaderButton loading={isSubmitting} disabled={!dirty || !isValid || isSubmitting}>Submit</LoaderButton>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default Login