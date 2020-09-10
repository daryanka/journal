import React, {FC} from "react";
import ReactDOM from "react-dom";
import "./styles.scss";
import Day from "./Containers/Day";
import DayTwo from "./Containers/DayTwo";

const App: FC = () => {
  return(
    <div>
      <DayTwo />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))