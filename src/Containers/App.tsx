import React, {FC} from "react";
import NavBar from "./NavBar";
import {Redirect, Route, Switch,} from "react-router-dom";
import PrivateRoute from "../Components/PrivateRoute";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Footer from "./Footer";

const App: FC = () => {
  return(
    <div className={"app-wrapper"}>
      <NavBar/>
      <div className={"content-wrapper"}>
        <Switch>
          <Route exact path={"/"} component={Login}/>
          <Route exact path={"/register"} component={Register}/>
          <PrivateRoute exact component={Dashboard} path={"/dashboard"} />
          <PrivateRoute exact component={Comp} path={"/week"}/>
          <PrivateRoute exact component={Comp} path={"/day/:day"}/>
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