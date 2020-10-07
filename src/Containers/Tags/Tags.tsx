import React, {FC, useRef, useState} from "react";
import useTags, {TagType} from "./useTags";
import ContentLoader from "../../Components/ContentLoader";
import Modal, {modalOptionsI} from "../../Components/Modal";
import {FiEdit3} from "react-icons/fi/index";

const Tags: FC = () => {
  const modalRef = useRef<modalOptionsI>()
  const tags = useTags()
  const [activeTag, setActiveTag] = useState<null | TagType>()

  const openModal = () => modalRef.current && modalRef.current.open()
  const closeModal = () => modalRef.current && modalRef.current.close()

  const openOptions = (tag: TagType) => {
    setActiveTag(tag)
    openModal()
  }

  return (
    <div className={"tag-wrapper"}>
      <Modal ref={modalRef}>
        <ModalContent tag={activeTag as TagType} close={closeModal}  />
      </Modal>
      <h2>Tags</h2>
      <ContentLoader loading={tags.isLoading}>
        <div className={"table"}>
          <div className={"table-header"}>
            <p>Label</p>
            <p>Color</p>
          </div>
          {tags.data && tags.data.map(tag => {
            return (
              <Item item={tag} edit={openOptions} key={`tag-${tag.tag_id}`}/>
            )
          })}
        </div>
      </ContentLoader>
    </div>
  )
}

const Item: FC<{item: TagType, edit: (t: TagType) => void}> = ({item, edit}) => {
  return (
    <div className={"table-item"}>
      <div>{item.tag_name}</div>
      <div className={"hex-color"}>{item.hex_color}</div>
      <div className={"options"}><FiEdit3 onClick={() => edit(item)}/></div>
    </div>
  )
}

interface modalContentI {
  close: () => void
  tag: TagType
}

const ModalContent: FC<modalContentI> = (props) => {
  return(
    <div>
      <h1>{props.tag.tag_name}</h1>
      <button onClick={props.close}>Close</button>
    </div>
  )
}

export default Tags;