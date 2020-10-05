import React, {FC} from "react";

interface propsI {
  headers: string[]
}

const Table: FC<propsI> = (props) => {
  return (
    <div
      className={"table-wrapper"}
      style={{
        gridTemplateColumns: `repeat(${props.headers.length}, 1fr)`
      }}
    >
      {props.headers.map((h, i) => {
        return <p key={`header-${i}-${h}`} className={"header"}>{h}</p>
      })}
      {props.children}
    </div>
  )
}

export default Table;