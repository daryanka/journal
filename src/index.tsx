import React, {FC} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import "./styles.scss";
import store from "./store";
import App from "./Containers/App";
import history from "./history";
import {Router} from "react-router-dom";

const RootApp: FC = () => {
  return(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  )
}

ReactDOM.render(<RootApp />, document.getElementById("root"))