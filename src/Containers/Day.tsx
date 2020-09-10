import React, {FC, useState} from "react";

const times = [
  {t1: "00:00", t2: "00:30"},
  {t1: "00:30", t2: "01:00"},
  {t1: "01:00", t2: "01:30"},
  {t1: "01:30", t2: "02:00"},
  {t1: "02:00", t2: "02:30"},
  {t1: "02:30", t2: "03:00"},
  {t1: "03:00", t2: "03:30"},
  {t1: "03:30", t2: "04:00"},
  {t1: "04:00", t2: "04:30"},
  {t1: "04:30", t2: "05:00"},
  {t1: "05:00", t2: "05:30"},
  {t1: "05:30", t2: "06:00"},
  {t1: "06:00", t2: "06:30"},
  {t1: "06:30", t2: "07:00"},
  {t1: "07:00", t2: "07:30"},
  {t1: "07:30", t2: "08:00"},
  {t1: "08:00", t2: "08:30"},
  {t1: "08:30", t2: "09:00"},
  {t1: "09:00", t2: "09:30"},
  {t1: "09:30", t2: "10:00"},
  {t1: "10:00", t2: "10:30"},
  {t1: "10:30", t2: "11:00"},
  {t1: "11:00", t2: "11:30"},
  {t1: "11:30", t2: "12:00"},
  {t1: "12:00", t2: "12:30"},
  {t1: "12:30", t2: "13:00"},
  {t1: "13:00", t2: "13:30"},
  {t1: "13:30", t2: "14:00"},
  {t1: "14:00", t2: "14:30"},
  {t1: "14:30", t2: "15:00"},
  {t1: "15:00", t2: "15:30"},
  {t1: "15:30", t2: "16:00"},
  {t1: "16:00", t2: "16:30"},
  {t1: "16:30", t2: "17:00"},
  {t1: "17:00", t2: "17:30"},
  {t1: "17:30", t2: "18:00"},
  {t1: "18:00", t2: "18:30"},
  {t1: "18:30", t2: "19:00"},
  {t1: "19:00", t2: "19:30"},
  {t1: "19:30", t2: "20:00"},
  {t1: "20:00", t2: "20:30"},
  {t1: "20:30", t2: "21:00"},
  {t1: "21:00", t2: "21:30"},
  {t1: "21:30", t2: "22:00"},
  {t1: "22:00", t2: "22:30"},
  {t1: "22:30", t2: "23:00"},
  {t1: "23:00", t2: "23:30"},
  {t1: "23:30", t2: "00:00"},
]

interface TimeType {
  start: string
  end: string
  title: string
  description: string
}

const boxHeight = 50;

const Day: FC = () => {
  const [state, setState] = useState<TimeType[]>([
    {
      description: "description here description here description here description here description here description here description heredescription here description here",
      start: "01:30",
      end: "02:00",
      title: "Work"
    }
  ]);

  return (
    <div className={"day"}>
      <div className="left">
        {times.map((day, i) => {
          return (
            <div style={{
              minHeight: `${boxHeight}px`
            }} key={`${day.t1}-${day.t2}`} className={"day-part"}>
              <p className="t1">{day.t1}</p>
              {i === times.length - 1 && <p className={"t2"}>{day.t2}</p>}
            </div>
          )
        })}
        {state.map((part, i) => {
          // Calculate top needed using time start
          const [startHours, startMinutes] = part.start.split(":")
          let marginCount = parseInt(startHours) * 2
          if (startMinutes === "30") {
            marginCount++
          }

          // Calculate height using distance between time start and time end
          const [endHours, endMinutes] = part.end.split(":")
          let distance = (parseInt(endHours) - parseInt(startHours)) * 2
          if (endMinutes === "30") {
            distance++
          }
          if (startMinutes === "30") {
            distance--
          }

          return (
            <div className={"allocated-part"} style={{
              height: `${distance * boxHeight - 10}px`,
              top: `${marginCount * boxHeight + 25}px`
            }} key={`${part.title}-${i}`}>
              <p>{part.title}</p>
              <p>{part.description}</p>
              <p>{marginCount}</p>
            </div>
          )
        })}
      </div>
      <div className="right">
        <h3>Description:</h3>
        <textarea></textarea>
      </div>
    </div>
  )
}

export default Day