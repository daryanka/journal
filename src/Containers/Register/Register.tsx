import React, {FC, useState} from "react";
import {Form, Formik, FormikHelpers} from "formik";
import InputField from "../../Components/InputField";
import * as Yup from "yup";
import LoaderButton from "../../Components/LoaderButton";
import useRegister from "./useRegister";
import {Link} from "react-router-dom";

interface registerFormType {
  email: string
  password: string
  password_confirmation: string
}

const registerFormSchema = Yup.object().shape({
  email: Yup.string().email().required().max(255),
  password: Yup.string().required().min(6).max(50),
  password_confirmation: Yup.string().required().min(6).max(50).oneOf([Yup.ref("password"), ""], "Must match password").label("Confirm Password")
})

const Register: FC = () => {
  const submitRegister = useRegister()
  const [apiError, setAPIError] = useState<string | React.ReactElement>("");

  const handleSubmit = async (values: registerFormType, helpers: FormikHelpers<registerFormType>) => {
    const errString = await submitRegister(values)

    if (errString) {
      if (errString === "EMAIL_USED") {
        setAPIError(<>This Email is already in use, login <strong><Link to={"/login"}>here.</Link></strong></>)
        return
      }
      setAPIError(errString)
    }
  }

  return (
    <div className={"login-wrapper"}>
      <div className="box">
        <h2>Register</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
            password_confirmation: ""
          }}
          validationSchema={registerFormSchema}
          onSubmit={handleSubmit}
        >
          {({dirty, isValid, isSubmitting}) => {
            return (
              <Form>
                <InputField name={"email"} label={"Email*"}/>
                <InputField type={"password"} name={"password"} label={"Password*"}/>
                <InputField type={"password"} name={"password_confirmation"} label={"Confirm Password*"}/>
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

export default Register