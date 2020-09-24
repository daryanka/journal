import React from "react";
import Cookie from "js-cookie";
import functions from "../functions";
import {useDispatch} from "react-redux";
import {CLEAR_USER} from "../reducers/authReducer";
import FullScreenSpinner from "../Components/FullScreenSpinner";

const Logout = () => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    // Remove token cookie
    Cookie.remove("token")


    // Update Redux
    dispatch({
      type: CLEAR_USER
    })

    // Redirect to "/"
    functions.pushTo("/")
  })

  return <FullScreenSpinner />
}

export default Logout