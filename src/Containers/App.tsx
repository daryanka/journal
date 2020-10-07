import React, {FC, useState} from "react";
import NavBar from "./Nav/NavBar";
import {Redirect, Route, Switch,} from "react-router-dom";
import PrivateRoute from "../Components/PrivateRoute";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import {useDispatch} from "react-redux";
import cookie from "js-cookie";
import functions from "../functions";
import {NEW_USER} from "../reducers/authReducer";
import FullScreenSpinner from "../Components/FullScreenSpinner";
import PublicRoute from "../Components/PublicRoute";
import Logout from "./Logout";
import Day from "./Day/Day";
import {useSetRedirectURL} from "../RedirectContext";
import Tags from "./Tags/Tags";

const App: FC = () => {
  const setURL = useSetRedirectURL()
  const [loadingAuth, setLoadingAuth] = useState(false)
  const dispatch = useDispatch()
  React.useEffect(() => {
    handleLoggedInUser()
  }, [])

  const handleLoggedInUser = async () => {
    const token = cookie.get("token")
    if (token) {
      setLoadingAuth(true)
      // Get ME
      const res = await functions.get("/auth/me")
      const err = functions.error(res)
      if (err) {
        setLoadingAuth(false)
        return
      }

      // Update Redux State
      dispatch({
        type: NEW_USER,
        payload: {
          email: res.data.email,
          id: res.data.id
        }
      })

      setLoadingAuth(false)

      setURL((prev) => {
        if (prev) {
          functions.pushTo(prev)
        } else {
          functions.pushTo("/week")
        }

        return null
      })
    }
  }

  if (loadingAuth) {
    return <FullScreenSpinner />
  }

  return(
    <div className={"app-wrapper"}>
      <NavBar/>
      <div className={"content-wrapper"}>
        <Switch>
          <PublicRoute exact component={Login} path={"/"}/>
          <PublicRoute exact component={Register} path={"/register"}/>
          <PrivateRoute exact component={Dashboard} path={"/dashboard"} />
          <PrivateRoute exact component={Comp} path={"/week"}/>
          <PrivateRoute exact component={Day} path={"/day/:day"}/>
          <PrivateRoute exact component={Tags} path={"/tags"}/>
          <Route exact component={Logout} path={"/logout"} />
          <Redirect to={"/"}/>
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

const Comp = () => {
  console.log("inside comp")
  return (
    <h1>Private</h1>
  )
}

export default App