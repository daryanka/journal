import React, {FC, useState} from "react";
import {Formik, Form} from "formik";
import * as yup from "yup";
import {queryCache, useMutation} from "react-query";
import functions, {ErrorType} from "../../functions";
import {TagType} from "./useTags";
import InputField from "../../Components/InputField";
import {SketchPicker} from "react-color";
import LoaderButton from "../../Components/LoaderButton";

const editSchema = yup.object().shape({
  tag_name: yup.string().required().label("Tag Name")
})

interface propsI {
  close: () => void
}

interface createTagI {
  hex_color: string
  tag_name: string
}

interface resType {
  hex_color: string
  tag_name: string
  tag_id: number
}

const CreateTag: FC<propsI> = (props) => {
  const [update, info] = useMutation<resType, ErrorType, createTagI>(async (data: createTagI ) => {
    const res = await functions.post<{id: number}>(`/tag/`, data)
    const err = functions.error(res)
    if (err) {
      throw err
    }
    return {
      ...data,
      tag_id: res.data.id
    }
  }, {
    onSuccess: (newData) => {
      queryCache.setQueryData(["tags"], (data) => {
        const copy = [...data as TagType[]]

        if (copy) {
          copy.push(newData)
        }

        return data
      })
      queryCache.invalidateQueries(["tags"])
      props.close()
    }
  })
  const [color, setColor] = useState<string>("#6bd060")

  const handleSubmit = async (data: {tag_name: string}) => {
    await update({
      hex_color: color,
      tag_name: data.tag_name
    })
  }

  return(
    <div>
      <h1>New Tag</h1>
      <Formik
        initialValues={{
          tag_name: ""
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
              {info.isError && <p className={"error-msg"}>{info?.error?.message}</p>}
              <div className="btns">
                <LoaderButton onClick={props.close} type={"button"}>Cancel</LoaderButton>
                <LoaderButton loading={info.isLoading} disabled={info.isLoading} type={"submit"}>Create</LoaderButton>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default CreateTag;