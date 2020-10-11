import React, {FC, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {useQuery} from "react-query";
import functions from "../../functions";
import {DayType} from "../Day/Day";

interface stateType {
  start_day: Dayjs
  end_day: Dayjs
}

const Week: FC = (props) => {
  const [week, setWeek] = useState<stateType>({
    start_day: dayjs().startOf("week"),
    end_day: dayjs().endOf("week"),
  })

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

    return res.data
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

  console.log("week data", weekInfo.data)

  return (
    <div>
      <p>Start: {week.start_day.format("YYYY-MM-DD dddd")}</p>
      <p>End: {week.end_day.format("YYYY-MM-DD dddd")}</p>
      <button onClick={nextWeek}>next week</button>
      <button onClick={lastWeek}>last week</button>
    </div>
  )
}

export default Week;