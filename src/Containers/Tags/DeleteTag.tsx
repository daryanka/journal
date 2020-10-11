import React, {FC} from "react";
import {queryCache, useMutation, useQuery} from "react-query";
import functions from "../../functions";
import ContentLoader from "../../Components/ContentLoader";
import LoaderButton from "../../Components/LoaderButton";
import {TagType} from "./useTags";

interface propsI {
  id: number
  close: () => void
}

const DeleteTag: FC<propsI> = (props) => {
  const data = useQuery(["tag-in-use", props.id], async () => {
    const res = await functions.get<{"error": false, "in-use": boolean}>(`/tag/in-use/${props.id}`)
    const err = functions.error(res)
    if (err) {
      throw err
    }
    return res.data
  })
  const [mutate, info] = useMutation(async () => {
    const res = await functions.delete(`/tag/${props.id}`)
    const err = functions.error(res)
    if (err) {
      throw err
    }
    return props.id
  }, {
    onSuccess: (deleteID) => {
      queryCache.setQueryData("tags", (tags) => {
        if (tags) {
          const t = [...tags as TagType[]]
          return t.filter(x => x.tag_id !== deleteID)
        }
        return tags
      })
      queryCache.invalidateQueries("tags")
      props.close()
    }
  })

  return (
    <ContentLoader loading={data.isLoading}>
      {data.data && data.data["in-use"] ? (
        <div>
          <h2>This tag is in use, and therefore cannot be deleted.</h2>
          <div className="btns-right">
            <LoaderButton onClick={props.close}>Close</LoaderButton>
          </div>
        </div>
      ) : (
        <div className={"edit-tag"}>
          <h2>Are you sure you want to delete this tag?</h2>
          <div className={"btns-right"}>
            <LoaderButton onClick={props.close}>Close</LoaderButton>
            <LoaderButton
              loading={info.isLoading}
              disabled={info.isLoading}
              onClick={() => mutate()}
            >
              Delete
            </LoaderButton>
          </div>
        </div>
      )}
    </ContentLoader>
  )
}

export default DeleteTag;