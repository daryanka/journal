import React, {FC, useRef} from "react";
import useTags, {TagType} from "./useTags";
import ContentLoader from "../../Components/ContentLoader";
import Modal, {modalOptionsI} from "../../Components/Modal";
import {FiEdit3, RiDeleteBin2Line} from "react-icons/all";
import EditTag from "./EditTag";
import DeleteTag from "./DeleteTag";
import LoaderButton from "../../Components/LoaderButton";
import CreateTag from "./CreateTag";

const Tags: FC = () => {
  const tags = useTags()
  const createRef = useRef<modalOptionsI>();

  return (
    <div className={"tag-wrapper"}>
      <Modal className={"edit-tag-modal"} ref={createRef}>
        <CreateTag close={() => createRef.current!.close()} />
      </Modal>
      <h2 className={"title"}>Tags</h2>
      <ContentLoader loading={tags.isLoading}>
        <div className={"create-btn"}>
          <LoaderButton onClick={() => createRef.current!.open()}>
            New Tag
          </LoaderButton>
        </div>
        <div className={"table"}>
          <div className={"table-header"}>
            <p>Label</p>
            <p>Color</p>
          </div>
          {tags.data && tags.data.map(tag => {
            return (
              <Item item={tag} key={`tag-${tag.tag_id}`}/>
            )
          })}
        </div>
      </ContentLoader>
    </div>
  )
}

const Item: FC<{item: TagType}> = ({item}) => {
  const editRef = useRef<modalOptionsI>()
  const deleteRef = useRef<modalOptionsI>()
  return (
    <div className={"table-item"}>
      <Modal className={"edit-tag-modal"} ref={editRef}>
        <EditTag tag={item} close={() => editRef.current!.close()} />
      </Modal>
      <Modal ref={deleteRef}>
        <DeleteTag id={item.tag_id} close={() => deleteRef.current!.close()} />
      </Modal>
      <div>{item.tag_name}</div>
      <div className={"hex-color"}>{item.hex_color}</div>
      <div className={"options"}>{item.user_id ? (
        <>
          <FiEdit3 onClick={() => editRef.current!.open()}/>
          <RiDeleteBin2Line onClick={() => deleteRef.current!.open()} />
        </>
      ) : (
          <p><i>Default</i></p>
        )}</div>
    </div>
  )
}

export default Tags;