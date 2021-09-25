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
  dateString: string
}

const WeekDayView: FC<propsI> = (props) => {
  const pieData = useMemo(() => {
    const returnData: { data: number[], labels: string[], colors: string[] } = {
      data: [],
      labels: [],
      colors: []
    }

    const groupedDataByTagID: { [key: string]: number } = {}
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

  return (
    <div className={"week-day"}>
      <h2 onClick={() => functions.pushTo(`/day/${props.dateString}`)} className={"day-title"}>{props.day}</h2>

      <div className="day-view">
        {times.map(el => {
          return (
            <div key={`t1-${el.t1}`} className={"t-part"}/>
          )
        })}
        {props.data.map(day => {
          return <AllocationPart key={`week-day-allocation-${day.id}`} day={day} />
        })}
      </div>
      <div className="pie-wrapper">
        {pieData.data.length > 0 && (
          <Pie
            data={{
              datasets: [{
                data: pieData.data,
                backgroundColor: pieData.colors
              }],

              labels: pieData.labels,
            }}
            options={{
              maintainAspectRatio: false,
              legend: {
                display: false
              },
              tooltips: {
                displayColors: false,
                callbacks: {
                  label: (tooltipItem, data) => {
                    const val = data!.datasets![0].data![tooltipItem.index as number]
                    return `${data!.labels![tooltipItem.index as number]} ${val}%`
                  }
                }
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

const AllocationPart: FC<{day: DayType}> = ({day}) => {
  const data = useMemo(() => {
    // single box height = 10px

    // Calculate allocation height from
    const boxHeight = ((functions.timeToMinutesNumber(day.end_time) - functions.timeToMinutesNumber(day.start_time)) / 30) * 10

    // Calculate height from top
    const heightFromTop = (functions.timeToMinutesNumber(day.start_time) / 30) * 10

    return {
      height: boxHeight,
      top: heightFromTop
    }
  }, [day])

  return (
    <div
      style={{
        top: `${data.top + 12}px`,
        height: `${data.height - 4}px`,
        backgroundColor: day.hex_color ? day.hex_color : NoTagColor
      }}
      className={"week-day-allocation"}
      key={`week-day-allocation-${day.id}`}
    >
      <div className="tooltip">
        <p>{day.tag_name ? day.tag_name : "Not Tagged"}</p>
        <div className="down-triangle" />
      </div>

    </div>
  )
}

export default WeekDayView;