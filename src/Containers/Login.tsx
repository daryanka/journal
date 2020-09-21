import React, {FC} from "react";
import {Form, Formik} from "formik";
import InputField from "../Components/InputField";
import * as Yup from "yup";
import LoaderButton from "../Components/LoaderButton";

interface loginFormType {
  email: string
  password: string
}

const loginFormSchema = Yup.object().shape({
  email: Yup.string().email().required().max(255),
  password: Yup.string().required().min(6).max(50)
})

const Login: FC = () => {

  const handleSubmit = (values: loginFormType) => {

  }

  return(
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
            return(
              <Form>
                <InputField name={"email"} label={"Email*"} />
                <InputField type={"password"} name={"password"} label={"Password*"} />
                <LoaderButton disabled={true}>Submit</LoaderButton>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default Login