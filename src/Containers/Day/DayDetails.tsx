import React, {FC, useMemo, useState} from "react";
import {DayType} from "./Day";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import TextField from "../../Components/TextField";
import LoaderButton from "../../Components/LoaderButton";
import {useMutation} from "react-query";
import {UpdateDayDetails} from "./useDay";
import useTags from "../Tags/useTags";
import SelectTagField from "../../Components/SelectTagField";

interface propsI {
  day: DayType | null | undefined
  handleUpdateDay: (d: DayType, type: string) => void
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required().max(255),
  description: Yup.string(),
  tag_id: Yup.string().label("Tag")
})

interface formTypes {
  title: string
  description?: string
  tag_id?: string
}

const DayDetails: FC<propsI> = (props) => {
  const tagInfo = useTags()
  const selectOptions = useMemo(() => tagInfo.data ? tagInfo.data.map(el => ({
    value: `${el.tag_id}`,
    label: el.tag_name,
    color: el.hex_color
  })) : [] ,[tagInfo.data])
  const [mutate] = useMutation(UpdateDayDetails, {
    onSuccess: data => {
      if (data.tag_id) {
        const t = tagInfo.data!.find(el => el.tag_id === data.tag_id)
        data.hex_color = t!.hex_color
      } else {
        data.hex_color = undefined
      }
      console.log("updated/saved data", data)
      props.handleUpdateDay(data, data.type)
    }
  })
  const handleSubmit = async (values: formTypes) => {
    const data = {
      ...props.day as DayType,
      title: values.title,
      description: values.description ? values.description : "",
      tag_id: values.tag_id ? parseInt(values.tag_id) : undefined
    }
    await mutate({
      data: data
    })
  }

  if (!props.day) {
    return null
  }

  return (
    <div className="right">
      <Formik
        initialValues={{
          title: props.day?.title,
          description: props.day?.description,
          tag_id: props.day?.tag_id ? `${props.day.tag_id}` : undefined
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({isSubmitting}) => (
           <Form>
             <InputField name={"title"} label={"Title"} />
             <TextField name={"description"} label={"Description"} />
             <SelectTagField
               placeholder={"Tag..."}
               name={"tag_id"}
               options={selectOptions}
               clearable
             />
             <div className="btn-r">
               <LoaderButton disabled={isSubmitting} loading={isSubmitting}>Save</LoaderButton>
             </div>
           </Form>
         )}
      </Formik>
    </div>
  )
}

export default DayDetails;