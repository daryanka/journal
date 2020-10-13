import React, {FC, useMemo, useState} from "react";
import {DayType} from "./Day";
import functions from "../../functions";
import {BiPlusMedical} from "react-icons/all";

interface propsI {
  boxHeight: number,
  t1: string,
  t2: string,
  last: boolean
  handleNew: (t1: string, t2: string) => void
  days: DayType[]
}

const isBetween = (num: number, start: number, end: number) => num > start && num < end

const DayPart: FC<propsI> = ({days, ...props}) => {
  const [hovering, setHovering] = useState(false)
  const inUse = useMemo(() => {
    // Loop through days
    for (let i = 0; i < days.length; i++) {
      const curr = days[i]
      const startMins = functions.timeToMinutesNumber(curr.start_time)
      const endMins = functions.timeToMinutesNumber(curr.end_time)
      const num1 = functions.timeToMinutesNumber(props.t1)
      const num2 = functions.timeToMinutesNumber(props.t2)

      if (isBetween(num1, startMins, endMins) || isBetween(num2, startMins, endMins) || props.t1 === curr.start_time) {
        return true
      }
    }
    return false
  }, [days])


  const handleClick = () => {
    if (!inUse) {
      props.handleNew(props.t1, props.t2)
    }
  }

  return (
    <div
      onMouseEnter={() =>  setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{minHeight: `${props.boxHeight}px`}}
      key={`${props.t1}-${props.t2}`}
      className={`day-part ${!inUse ? "free" : ""}`}
      onClick={() => handleClick()}
    >
      {hovering && <BiPlusMedical />}
      <p className="t1">{functions.timeToMinutesNumber(props.t1)}</p>
      {props.last && <p className={"t2"}>{props.t2}</p>}
    </div>
  )
}

export default DayPart;