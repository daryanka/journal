import React, {FC, useRef, useState} from "react";
import useTags, {TagType} from "./useTags";
import ContentLoader from "../../Components/ContentLoader";
import Modal, {modalOptionsI} from "../../Components/Modal";
import {FiEdit3} from "react-icons/fi/index";
import {queryCache, useMutation} from "react-query";
import functions from "../../functions";
import InputField from "../../Components/InputField";
import {Formik, Form} from "formik";
import { SketchPicker } from 'react-color';
import LoaderButton from "../../Components/LoaderButton";
import * as yup from "yup";

const editSchema = yup.object().shape({
  tag_name: yup.string().required().label("Tag Name")
})

const Tags: FC = () => {
  const tags = useTags()

  return (
    <div className={"tag-wrapper"}>

      <h2>Tags</h2>
      <ContentLoader loading={tags.isLoading}>
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
  const modalRef = useRef<modalOptionsI>()

  return (
    <div className={"table-item"}>
      <Modal className={"edit-tag-modal"} ref={modalRef}>
        <ModalContent tag={item} close={() => modalRef.current!.close()} />
      </Modal>
      <div>{item.tag_name}</div>
      <div className={"hex-color"}>{item.hex_color}</div>
      <div className={"options"}><FiEdit3 onClick={() => modalRef.current!.open()}/></div>
    </div>
  )
}

interface modalContentI {
  close: () => void
  tag: TagType
}

interface updateTagI {
  tag_id: number
  hex_color: string
  tag_name: string
}

const ModalContent: FC<modalContentI> = (props) => {
  React.useEffect(() => {
    setColor(props.tag.hex_color)
  }, [])

  const [update, info] = useMutation(async (data: updateTagI ) => {
    const res = await functions.put(`/tag/`, data)
    const err = functions.error(res)
    if (err) {
     throw err
    }
    return data
  }, {
    onSuccess: (newData) => {
      queryCache.setQueryData(["tags"], (data) => {
        console.log("new data", newData)
        const copy = [...data as TagType[]]
        for (let i = 0; i < copy.length; i++) {
          if (copy[i].tag_id === props.tag.tag_id) {
            copy[i].hex_color = newData.hex_color
            copy[i].tag_name = newData.tag_name
            break
          }
        }

        return copy
      })
      queryCache.invalidateQueries(["tags"])
      props.close()
    }
  })
  const [color, setColor] = useState<string>("")

  const handleSubmit = async (data: {tag_name: string}) => {
    await update({
      hex_color: color,
      tag_id: props.tag.tag_id,
      tag_name: data.tag_name
    })
  }

  return(
    <div className={"edit-tag-modal"}>
      <h1>{props.tag.tag_name}</h1>
      <Formik
        initialValues={{
          tag_name: props.tag.tag_name
        }}
        validationSchema={editSchema}
        onSubmit={handleSubmit}
      >
        {() => {
          return (
            <Form>
              <InputField name={"tag_name"} label={"Tag Name"} />
              <p>Color</p>
              <div className="color">
                <div className="color-box" style={{
                  backgroundColor: color
                }} />
                <SketchPicker onChange={c => setColor(c.hex)} color={color} />
              </div>
              <div className="btns">
                <LoaderButton onClick={props.close} type={"button"}>Cancel</LoaderButton>
                <LoaderButton loading={info.isLoading} disabled={info.isLoading} type={"submit"}>Save</LoaderButton>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default Tags;