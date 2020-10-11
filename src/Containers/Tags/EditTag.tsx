import React, {FC, useState} from "react";
import {TagType} from "./useTags";
import {queryCache, useMutation} from "react-query";
import functions from "../../functions";
import {Form, Formik} from "formik";
import InputField from "../../Components/InputField";
import {SketchPicker} from "react-color";
import LoaderButton from "../../Components/LoaderButton";
import * as yup from "yup";

const editSchema = yup.object().shape({
  tag_name: yup.string().required().label("Tag Name")
})

interface modalContentI {
  close: () => void
  tag: TagType
}

interface updateTagI {
  tag_id: number
  hex_color: string
  tag_name: string
}

const EditTag: FC<modalContentI> = (props) => {
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

export default EditTag;