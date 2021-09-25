import React, {FC, useMemo, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {useQuery} from "react-query";
import functions from "../../functions";
import {DayType} from "../Day/Day";
import ContentLoader from "../../Components/ContentLoader";
import _ from "lodash";
import WeekDayView from "./WeekDayView";
import useTags, {TagType} from "../Tags/useTags";

interface stateType {
  start_day: Dayjs
  end_day: Dayjs
}

export type WeekDays = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

const Week: FC = (props) => {
  const tagsInfo = useTags()
  const [week, setWeek] = useState<stateType>({
    start_day: dayjs().startOf("week").add(1, "day"),
    end_day: dayjs().endOf("week").add(1, "day"),
  })
  const prettyStart = week.start_day.format("YYYY MMMM D")
  const prettyEnd = week.end_day.format("YYYY MMMM D")

  const weekInfo = useQuery(["week", {
    start: week.start_day.format("YYYY-MM-DD"),
    end: week.end_day.format("YYYY-MM-DD"),
  }], async () => {
    const res = await functions.post<DayType[]>("/entries/range", {
      from: week.start_day.format("YYYY-MM-DD"),
      to: week.end_day.format("YYYY-MM-DD"),
    })
    const err = functions.error(res)
    if (err) {
      throw err
    }

    const days: { [day in WeekDays]: DayType[] } = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    }

    for (let i = 0; i < res.data.length; i++) {
      const d = dayjs(res.data[i].day).format("dddd") as WeekDays
      days[d].push(res.data[i])
    }

    return days
  }, {
    refetchOnWindowFocus: false
  })

  const nextWeek = () => {
    setWeek(prev => ({
      start_day: prev.start_day.add(1, "week"),
      end_day: prev.end_day.add(1, "week"),
    }))
  }

  const lastWeek = () => {
    setWeek(prev => ({
      start_day: prev.start_day.subtract(1, "week"),
      end_day: prev.end_day.subtract(1, "week"),
    }))
  }

  return (
    <div className={"week-wrapper"}>
      <ContentLoader loading={weekInfo.isLoading || tagsInfo.isLoading}>
        <div className="top">
          <h1>{prettyStart} - {prettyEnd}</h1>
          <button className={"f"} onClick={lastWeek}>Last Week</button>
          <button onClick={nextWeek}>Next Week</button>
        </div>
        <div className={"week-days-wrapper"}>
          {weekInfo.data && _.map(weekInfo.data, (el, key) => {
            let addAmount = 0
            switch (key) {
              case "Monday":
                addAmount = 0
                break;
              case "Tuesday":
                addAmount = 1
                break;
              case "Wednesday":
                addAmount = 2
                break;
              case "Thursday":
                addAmount = 3
                break;
              case "Friday":
                addAmount = 4
                break;
              case "Saturday":
                addAmount = 5
                break;
              case "Sunday":
                addAmount = 6
                break;
            }

            const dateString = week.start_day.add(addAmount, "day").format("YYYY-MM-DD")
            return (
              <WeekDayView dateString={dateString} tags={tagsInfo.data as TagType[]} data={el} key={`weekday-${key}`} day={key as WeekDays}/>
            )
          })}
        </div>
      </ContentLoader>
    </div>
  )
}

export default Week;