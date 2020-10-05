import React, {FC} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import "./styles.scss";
import store from "./store";
import App from "./Containers/App";
import {Router} from "react-router-dom";
import history from "./history";
import RedirectContextProvider from "./RedirectContext";

const RootApp: FC = () => {
  return(
    <Provider store={store}>
      <RedirectContextProvider>
        <Router history={history}>
          <App/>
        </Router>
      </RedirectContextProvider>
    </Provider>
  )
}

ReactDOM.render(<RootApp />, document.getElementById("root"))