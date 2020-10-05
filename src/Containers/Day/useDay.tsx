import React from "react";
import functions from "../../functions";
import {DayType} from "./Day";
import {queryCache} from "react-query";

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
  const res = await functions.put("/entries/", data.data)
  const err = functions.error(res)
  if (err) {
    throw err
  }
  return data
}