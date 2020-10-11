import React, {FC, useRef, useState, useCallback} from "react";
import functions, {ErrorType} from "../../functions";
import {GetDayQuery, UpdateDayQuery} from "./useDay";
import {RouteComponentProps} from "react-router-dom"
import {useMutation, useQuery} from "react-query";
import ContentLoader from "../../Components/ContentLoader";
import DayDetails from "./DayDetails";
import useTags from "../Tags/useTags";
import DayPart from "./DayPart";
import dayjs from "dayjs";
import Modal, {modalOptionsI} from "../../Components/Modal";
import LoaderButton from "../../Components/LoaderButton";

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
  hex_color?: string
}

const Day: FC<RouteComponentProps<{ day: string }>> = (props) => {
  const [newSaved, setNewSaved] = useState(true)
  const modalRef = useRef<modalOptionsI>()
  const tagData = useTags()
  const [activeDay, setActiveDay] = useState<null | DayType>(null)
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const [state, _setState] = useState<DayType[]>([]);
  const stateRef = useRef(state)
  const setState = (data: DayType[]) => {
    stateRef.current = [...data]
    return _setState(data)
  }
  const [updateSection] = useMutation(UpdateDayQuery, {
    onSuccess: (i) => {
      // Remove from updating
      removeUpdating(i)
    },
  })
  const [updating, setUpdating] = useState<number[]>([])
  const [boxHeight, setBoxHeight] = useState(30)
  const data = useQuery<DayType[], ErrorType>(["today", {day: props.match.params.day}], GetDayQuery, {
    refetchOnWindowFocus: false,
    retryDelay: 200,
    onSuccess: (data) => {
      setState(data)
    }
  })

  React.useEffect(() => {
    setActiveDay(null)
  }, [props.match.params.day])

  const addUpdating = (index: number) => {
    setUpdating(prev => [...prev, index])
  }

  const removeUpdating = (index: number) => {
    setUpdating(prev => {
      return prev.filter(el => el !== index)
    })
  }

  const calculateLatestAllowedEnd = (stateIndex: number, currentEnd: number): number => {
    const copyState = [...stateRef.current];
    // Remove state index
    copyState.splice(stateIndex, 1)
    if (copyState.length === 0) {
      return 1440
    }

    let latestEnd = 1440
    // Loop through remaining state and find the earliest start time that is after the currentEnd
    for (let i = 0; i < copyState.length; i++) {
      const startNumber = functions.timeToMinutesNumber(copyState[i].start_time)

      // find smallest start number below current end number
      if (startNumber >= currentEnd && startNumber <= latestEnd) {
        latestEnd = startNumber
      }
    }

    if (latestEnd === 0) {
      return 1440
    }

    return latestEnd
  }

  const calculateEarliestAllowedStart = (stateIndex: number, currentStart: number): number => {
    const copyState = [...stateRef.current];
    // Remove state index
    copyState.splice(stateIndex, 1)
    if (copyState.length === 0) {
      return 0
    }

    let earliestStart = 1440
    // Loop through remaining state and find the earliest start time that is after the currentEnd
    for (let i = 0; i < copyState.length; i++) {
      const endNumber = functions.timeToMinutesNumber(copyState[i].end_time)
      if (endNumber <= currentStart) {
        earliestStart = endNumber
      }
    }

    if (earliestStart === 1440) {
      return 0
    }

    return earliestStart
  }

  const MoveEndDown = (stateIndex: number, times = 1) => {
    _setState(prev => {
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
    _setState(prev => {
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
    _setState(prev => {
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
    _setState(prev => {
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
    if (stateRef.current[i].id !== 0) {
      addUpdating(i)
    }
    _setState(prev => {
      if (prev[i].id !== 0) {
        updateSection({
          data: prev[i],
          index: i
        })
      }
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

  const handleNewAllocationPart = (t1: string, t2: string) => {
    if (!newSaved) {
      modalRef.current!.open()
      return
    }
    setNewSaved(false)
    const dayTime = dayjs().format("YYYY-MM-DD")
    const data = {
      id: 0,
      end_time: t2,
      start_time: t1,
      day: dayTime,
      description: "",
      title: ""
    }
    setActiveDay(data)
    setState([...state, data])
  }

  const handleUpdateDay = (day: DayType) => {
    setNewSaved(true)
    const copyState = [...state]
    const i = copyState.findIndex(el => el.id === day.id)
    copyState[i] = day
    setState(copyState)
  }

  const handleDiscardNew = () => {
    setState(state.filter(x => x.id !== 0))
    setNewSaved(true)
    setActiveDay(null)
    modalRef.current!.close()
  }

  const handleSetActiveDay = (part: DayType) => {
    if (!newSaved && part.id !== 0) {
      modalRef.current!.open()
      return
    }
    setActiveDay(part)
  }

  React.useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [])

  return (
    <div className={"day"}>
      <Modal ref={modalRef}>
        <ModalContent discard={handleDiscardNew} close={() => modalRef.current!.close()} />
      </Modal>
      <ContentLoader loading={data.isLoading || data.isFetching || tagData.isLoading}>
        <div ref={leftBoxRef} className="left">
          {times.map((day, i) => {
            return <DayPart
              key={`${day.t1}-${day.t2}`}
              days={state}
              boxHeight={boxHeight}
              t1={day.t1}
              t2={day.t2}
              last={i === times.length - 1}
              handleNew={handleNewAllocationPart}
            />
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

            const isUpdating = updating.includes(i)

            return (
              <div
                className={`allocated-part ${isUpdating ? "updating" : ""}`}
                id={"testing"}
                style={{
                  height: `${distance * boxHeight - 10}px`,
                  top: `${marginCount * boxHeight + 5}px`
                }} key={`${part.title}-${i}`}>
                <div onClick={() => handleSetActiveDay(part)} className={"part-details"}>
                  {isUpdating && (
                    <div className="loader">
                      <div className="spinner">
                        <div className="bounce1"/>
                        <div className="bounce2"/>
                        <div className="bounce3"/>
                      </div>
                    </div>
                  )}
                  {!isUpdating && <div data-state-index={i} className="top-handle"/>}
                  <p>{part.title === "" ? "New Entry" : part.title}</p>
                  <p>{part.description}</p>
                  {!isUpdating && <div data-state-index={i} className="bottom-handle"/>}
                </div>
              </div>
            )
          })}
        </div>
        <DayDetails day={activeDay} handleUpdateDay={handleUpdateDay} />
      </ContentLoader>
    </div>
  )
}

interface modalI {
  close: () => void
  discard: () => void
}

const ModalContent: FC<modalI> = (props) => {
  return(
    <div>
      <h1>New entry not saved</h1>
      <p>Do you wish to discard the new entry?</p>
      <div className="btns">
        <LoaderButton onClick={() => props.close()}>Cancel</LoaderButton>
        <LoaderButton onClick={() => props.discard()}>Discard</LoaderButton>
      </div>
    </div>
  )
}

export default Day