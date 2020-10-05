import React, {FC} from 'react'
import {Redirect, Route, RouteProps} from 'react-router'
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {useSetRedirectURL} from "../RedirectContext";

interface propsType extends RouteProps {
  component: FC<any>
  path: string
}

const PrivateRoute: React.FC<propsType> = ({component: Component, ...rest}) => {
  const setURL = useSetRedirectURL()
  const authorized = useSelector((state: RootState) => state.auth.loggedIn)
  React.useEffect(() => {
    if (!authorized) {
      setURL(rest.location!.pathname as string)
    }
  }, [])

  return <Route {...rest} render={(props) => {
    if (authorized) {
      return <Component {...props} />
    }

    // Set redirect url
    return <Redirect to={"/"}/>
  }}/>
}

export default PrivateRoute