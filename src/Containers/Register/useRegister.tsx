import React from "react";
import functions from "../../functions";
import Cookie from "js-cookie";
import store from "../../store";
import {NEW_USER} from "../../reducers/authReducer";

type registerDataType = {
  email: string
  password: string
  password_confirmation: string
}

const useRegister = () => {
  return async (data: registerDataType) => {
    const res = await functions.post("/auth/register", data)
    let err = functions.error(res)
    if (err) {
      if (err.type) {
        return err.type
      }
      return err.message
    }

    // Change expires_in (minutes to day conversion)
    const expiresIn = (1 / 86400) * 3600
    // Add cookie
    Cookie.set("token", res.data.token, {
      expires: expiresIn
    })

    // Get ME
    const res2 = await functions.get("/auth/me")
    err = functions.error(res2)
    if (err) {
      return err.message
    }

    // Update Redux State
    store.dispatch({
      type: NEW_USER,
      payload: {
        email: res2.data.email,
        id: res2.data.id
      }
    })

    functions.pushTo("/week")
  }
}

export default useRegister