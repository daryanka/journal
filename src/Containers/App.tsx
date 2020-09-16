import React, {FC} from "react";
import Day from "./Day";
import axios from "axios";

const App: FC = () => {
  const fetchData = async () => {
    const res = await axios.post("http://localhost:8080/entries/range", {
      "from": "2020-09-01",
      "to": "2020-09-10"
    }, {
      headers: {
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsImV4cCI6MTYwMDI5MjUzMiwiaWF0IjoxNjAwMjg4OTMyLCJpc3MiOiJqb3VybmFsX2FwaSJ9.-tWxhf5ceDmO0HOxp2xyLpGKVaLDYptoSYeQw89XRb0`
      }
    })

    console.log(res)
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return(
    <div>
      <div style={{
        height: "100px",
        background: "tomato"
      }}>Header</div>
      <Day />
    </div>
  )
}

export default App