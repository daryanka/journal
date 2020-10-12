import React, {FC, useMemo} from "react";
import {WeekDays} from "./Week";
import {DayType, NoTagColor, times} from "../Day/Day";
import {Pie} from "react-chartjs-2";
import {TagType} from "../Tags/useTags";
import functions from "../../functions";
import _ from "lodash";

interface propsI {
  day: WeekDays
  data: DayType[]
  tags: TagType[]
}

const WeekDayView: FC<propsI> = (props) => {
  const pieData = useMemo(() => {
    const returnData: {data: number[], labels: string[], colors: string[]} = {
      data: [],
      labels: [],
      colors: []
    }

    const groupedDataByTagID: {[key: string]: number} = {}
    let total = 0

    for (let i = 0; i < props.data.length; i++) {
      const curr = props.data[i]
      // Calculate minutes
      const time = functions.timeToMinutesNumber(curr.end_time) - functions.timeToMinutesNumber(curr.start_time)
      total += time

      if (curr.tag_id) {
        groupedDataByTagID[curr.tag_id] ? groupedDataByTagID[curr.tag_id] += time : groupedDataByTagID[curr.tag_id] = time;
      } else {
        groupedDataByTagID["no-tag"] ? groupedDataByTagID["no-tag"] += time : groupedDataByTagID["no-tag"] = time;
      }
    }

    _.forEach(groupedDataByTagID, (time, key) => {
      const percent = Number(((time / total) * 100).toFixed(2))
      console.log(percent)
      if (key === "no-tag") {
        returnData.data.unshift(percent)
        returnData.labels.unshift("Not Tagged")
        returnData.colors.unshift(NoTagColor)
      } else {
        const tag = props.tags.find(x => x.tag_id === parseInt(key)) as TagType
        returnData.data.push(percent)
        returnData.labels.push(tag.tag_name)
        returnData.colors.push(tag.hex_color)
      }
    })

    return returnData
  }, [props.data])

  console.log(pieData)
  return (
    <div className={"week-day"}>
      <h2>{props.day}</h2>

      <div className="day-view">
        {times.map(el => {
          return(
            <div key={`t1-${el.t1}`} className={"t-part"} />
          )
        })}
      </div>
      <div className="pie-wrapper">
        <Pie data={{
          datasets: [{
            data: pieData.data,
            backgroundColor: pieData.colors
          }],

          labels: pieData.labels,
        }}
        />
      </div>
    </div>
  )
}

export default WeekDayView;