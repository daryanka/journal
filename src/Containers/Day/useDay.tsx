import React from "react";
import functions from "../../functions";
import {DayType} from "./Day";
import {queryCache} from "react-query";

export const GetQuery = async (key: string, data: {day: string}) => {
  const res = await functions.post(`/entries/day`, {
    day: data.day
  })

  const err = functions.error(res)
  if (err) {
    throw err
  }

  return res.data
}

export const UpdateQuery = async (data: {data: DayType, index: number}) => {
  const res = await functions.put("/entries/", data.data)
  const err = functions.error(res)
  if (err) {
    throw err
  }
  return data.index
}