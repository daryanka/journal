import React from "react";
import {useQuery} from "react-query";
import functions from "../../functions";

export interface TagType {
  tag_id: number
  tag_name: string
  user_id?: number
  hex_color: string
}

const useTags = () => useQuery(["tags"], async () => {
  const res = await functions.get<TagType[]>("/tag/")
  const err = functions.error(res)
  if (err) {
    throw err
  }

  return res.data
})


export default useTags