import React, {FC, useState} from "react";
import useTags, {TagType} from "./useTags";
import ContentLoader from "../../Components/ContentLoader";

const Tags: FC = (props) => {
  const tags = useTags()
  return (
    <div className={"tag-wrapper"}>
      <h2>Tags</h2>
      <ContentLoader loading={tags.isLoading}>

      </ContentLoader>
    </div>
  )
}

const Item = (t: TagType) => {
  const [editing, setEditing] = useState(false)
  return(
    <div className={"item"}>

    </div>
  )
}

export default Tags;