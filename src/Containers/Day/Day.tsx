import React, {FC, useRef, useState, useCallback, useMemo} from "react";
import functions, {ErrorType} from "../../functions";
import {GetQuery, UpdateQuery} from "./useDay";
import {RouteComponentProps} from "react-router-dom"
import {useMutation, useQuery} from "react-query";
import ContentLoader from "../../Components/ContentLoader";

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
  {t1: "23:30", t2: "24:00"},
]

export interface DayType {
  id: number
  day: string
  start_time: string
  end_time: string
  title: string
  description: string
  tag_id?: number
  tag_name?: string
}

const Day: FC<RouteComponentProps<{day: string}>> = (props) => {
  const [updateSection] = useMutation(UpdateQuery, {
    onSuccess: (i) => {
      // Remove from updating
      removeUpdating(i)
    }
  })
  const [updating, setUpdating] = useState<number[]>([])
  const [boxHeight, setBoxHeight] = useState(30)
  const data = useQuery<DayType[], ErrorType>(["today", {day: props.match.params.day}], GetQuery, {
    refetchOnWindowFocus: false,
    retryDelay: 200,
    onSuccess: (data) => {
      setState(data)
    }
  })

  const addUpdating = (index: number) => {
    setUpdating(prev => [...prev, index])
  }

  const removeUpdating = (index: number) => {
    setUpdating(prev => {
      return prev.filter(el => el !== index)
    })
  }

  const leftBoxRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DayType[]>([]);

  const calculateLatestAllowedEnd = (stateIndex: number, currentEnd: number): number => {
    const copyState = [...state];
    // Remove state index
    copyState.splice(stateIndex, 1)
    if (copyState.length === 0) {
      return 1440
    }

    let latestEnd = 0
    // Loop through remaining state and find the earliest start time that is after the currentEnd
    for (let i = 0; i < copyState.length; i++) {
      const startNumber = functions.timeToMinutesNumber(copyState[i].start_time)
      if (startNumber >= currentEnd && startNumber >= latestEnd) {
        latestEnd = startNumber
      }
    }

    if (latestEnd === 0) {
      return 1440
    }

    return latestEnd
  }

  const calculateEarliestAllowedStart = (stateIndex: number, currentStart: number): number => {
    const copyState = [...state];
    // Remove state index
    copyState.splice(stateIndex, 1)
    if (copyState.length === 0) {
      return 0
    }

    let earliestStart = 1440
    // Loop through remaining state and find the earliest start time that is after the currentEnd
    for (let i = 0; i < copyState.length; i++) {
      const endNumber = functions.timeToMinutesNumber(copyState[i].end_time)
      if (endNumber <= currentStart && endNumber <= earliestStart) {
        earliestStart = endNumber
      }
    }

    if (earliestStart === 1440) {
      return 0
    }

    return earliestStart
  }

  const MoveEndDown = (stateIndex: number, times = 1) => {
    setState(prev => {
      const copyState = [...prev]
      // Get state index
      const newEndTimeMinutes = functions.timeToMinutesNumber(copyState[stateIndex].end_time) + (30 * times)
      // Check its not the end
      const latestAllowedEndTime = calculateLatestAllowedEnd(stateIndex, functions.timeToMinutesNumber(copyState[stateIndex].end_time))
      if (newEndTimeMinutes >= latestAllowedEndTime) {
        copyState[stateIndex].end_time = functions.minutesToTimeString(latestAllowedEndTime)
      } else {
        copyState[stateIndex].end_time = functions.minutesToTimeString(newEndTimeMinutes)
      }
      return copyState
    })
  }

  const MoveStartDown = (stateIndex: number, times = 1) => {
    setState(prev => {
      const copyState = [...prev]
      // Get state index
      const newStartTimeMinutes = functions.timeToMinutesNumber(copyState[stateIndex].start_time) + (30 * times)

      // Make sure start cannot go beyond end
      if (newStartTimeMinutes >= functions.timeToMinutesNumber(copyState[stateIndex].end_time)) {
        copyState[stateIndex].start_time = functions.minutesToTimeString(functions.timeToMinutesNumber(copyState[stateIndex].end_time) - 30)
        return copyState
      }

      copyState[stateIndex].start_time = functions.minutesToTimeString(newStartTimeMinutes)
      return copyState
    })
  }

  const MoveEndUp = (stateIndex: number, times = 1) => {
    setState(prev => {
      const copyState = [...prev]
      // Get state index
      const newEndTimeMinutes = functions.timeToMinutesNumber(copyState[stateIndex].end_time) - (30 * times)

      // Make sure end is not above start
      if (newEndTimeMinutes <= functions.timeToMinutesNumber(copyState[stateIndex].start_time)) {
        copyState[stateIndex].end_time = functions.minutesToTimeString(functions.timeToMinutesNumber(copyState[stateIndex].start_time) + 30)
        return copyState
      }

      copyState[stateIndex].end_time = functions.minutesToTimeString(newEndTimeMinutes)
      return copyState
    })
  }

  const MoveStartUp = (stateIndex: number, times = 1) => {
    setState(prev => {
      const copyState = [...prev]
      // Get state index
      const newStartTimeMinutes = functions.timeToMinutesNumber(copyState[stateIndex].start_time) - (30 * times)
      const earliestAllowedStart = calculateEarliestAllowedStart(stateIndex, functions.timeToMinutesNumber(copyState[stateIndex].start_time))
      if (newStartTimeMinutes <= earliestAllowedStart) {
        copyState[stateIndex].start_time = functions.minutesToTimeString(earliestAllowedStart)
      } else {
        copyState[stateIndex].start_time = functions.minutesToTimeString(newStartTimeMinutes)
      }
      return copyState
    })
  }

  const updateState = async (i: number) => {
    addUpdating(i)
    setState(prev => {
      updateSection({
        data: prev[i],
        index: i
      })
      return prev
    })
  }

  const handleMouseDown = useCallback((e: MouseEvent) => {
    let moving = false
    if (e.target) {
      const div = e.target as HTMLDivElement
      if (div.className === "bottom-handle" || div.className === "top-handle") {
        const stateIndex = parseInt(div.dataset.stateIndex as string)

        // Mouse Move Handler
        const mouseMoveFunc = (e: MouseEvent) => {
          // Add resizing-el to body className
          document.body.classList.add("resizing-el")
          const distanceBetweenMouseAndBottomHandle = e.y - div!.getBoundingClientRect().top - 9

          if (distanceBetweenMouseAndBottomHandle > (boxHeight - 5) && !moving) {
            const times = Math.ceil(distanceBetweenMouseAndBottomHandle / boxHeight)
            moving = true
            div.className === "bottom-handle" ? MoveEndDown(stateIndex, times) : MoveStartDown(stateIndex, times)
            setTimeout(() => {
              moving = false
            }, 50)
          } else if (distanceBetweenMouseAndBottomHandle < -5 && !moving) {
            const times = Math.ceil(Math.abs(distanceBetweenMouseAndBottomHandle) / boxHeight)
            moving = true
            div.className === "bottom-handle" ? MoveEndUp(stateIndex, times) : MoveStartUp(stateIndex, times)
            setTimeout(() => {
              moving = false
            }, 50)
          }
        }
        //

        const removeListener = () => {
          document.body.classList.remove("resizing-el")
          document.removeEventListener("mousemove", mouseMoveFunc)
          document.removeEventListener("mouseup", removeListener)
          updateState(stateIndex)
        }

        document.addEventListener("mousemove", mouseMoveFunc)
        document.addEventListener("mouseup", removeListener)
      }
    }
  }, [])

  React.useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)

    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [])

  return (
    <div className={"day"}>
      <ContentLoader loading={data.isLoading}>
        <div ref={leftBoxRef} className="left">
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
            const [startHours, startMinutes] = part.start_time.split(":")
            let marginCount = parseInt(startHours) * 2
            if (startMinutes === "30") {
              marginCount++
            }

            // Calculate height using distance between time start and time end
            const [endHours, endMinutes] = part.end_time.split(":")
            let distance = (parseInt(endHours) - parseInt(startHours)) * 2
            if (endMinutes === "30") {
              distance++
            }
            if (startMinutes === "30") {
              distance--
            }

            return (
              <div
                className={`allocated-part ${updating.includes(i) ? "updating" : ""}`}
                id={"testing"}
                style={{
                  height: `${distance * boxHeight - 10}px`,
                  top: `${marginCount * boxHeight + 5}px`
                }} key={`${part.title}-${i}`}>
                <div className={"part-details"}>
                  <div data-state-index={i} className="top-handle"/>
                  <p>{part.title}</p>
                  <p>{part.description}</p>
                  <p>{marginCount}</p>
                  <div data-state-index={i} className="bottom-handle"/>
                </div>
              </div>
            )
          })}
        </div>
        <div className="right">
          <h3>Description:</h3>
          <textarea />
        </div>
      </ContentLoader>
    </div>
  )
}

export default Day