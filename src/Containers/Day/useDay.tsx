import React from "react";
import functions from "../../functions";
import {DayType} from "./Day";

export const GetDayQuery = async (key: string, data: {day: string}) => {
  const res = await functions.post(`/entries/day`, {
    day: data.day
  })

  const err = functions.error(res)
  if (err) {
    throw err
  }

  return res.data
}

export const UpdateDayQuery = async (data: {data: DayType, index: number}) => {
  const res = await functions.put("/entries/", data.data)
  const err = functions.error(res)
  if (err) {
    throw err
  }
  return data.index
}

export const UpdateDayDetails = async (data: {data: DayType}) => {
  if (data.data.id === 0) {
    const res = await functions.post<{id: number}>("/entries/", data.data)
    const err = functions.error(res)
    if (err) {
      throw err
    }
    return {...data, id: res.data.id}
  } else {
    const res = await functions.put("/entries/", data.data)
    const err = functions.error(res)
    if (err) {
      throw err
    }
    return data
  }
}