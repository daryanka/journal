import React, {FC} from 'react'
import {Redirect, Route, RouteProps} from 'react-router'
import {useSelector} from "react-redux";
import {RootState} from "../store";

interface propsType extends RouteProps {
  component: FC<any>
}

const PublicRoute: React.FC<propsType> = ({component: Component, ...rest}) => {
  const authorized = useSelector((state: RootState) => state.auth.loggedIn)
  return <Route {...rest} render={(props) => {
    return authorized ? <Redirect to={"/week"} /> :  <Component {...props} />
  }} />
}

export default PublicRoute