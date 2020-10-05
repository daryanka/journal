import React, {FC, useState} from "react";
import {DayType} from "./Day";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import TextField from "../../Components/TextField";
import LoaderButton from "../../Components/LoaderButton";
import {useMutation} from "react-query";
import {UpdateDayDetails} from "./useDay";
import useTags from "../Tags/useTags";

interface propsI {
  day: DayType | null | undefined
  handleUpdateDay: (d: DayType) => void
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required().max(255),
  description: Yup.string()
})

interface formTypes {
  title: string
  description?: string
}

const DayDetails: FC<propsI> = (props) => {
  const [tagList, setTagList] = useState()
  const tagData = useTags()
  const [mutate] = useMutation(UpdateDayDetails, {
    onSuccess: data => {
      props.handleUpdateDay(data.data)
    }
  })
  const handleSubmit = async (values: formTypes) => {
    const data = {
      ...props.day as DayType,
      title: values.title,
      description: values.description ? values.description : ""
    }
    await mutate({
      data: data
    })
  }

  if (!props.day) {
    return null
  }

  console.log(tagData.data)

  return (
    <div className="right">
      <Formik
        initialValues={{
          title: props.day?.title,
          description: props.day?.description,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({isSubmitting}) => (
           <Form>
             <InputField name={"title"} label={"Title"} />
             <TextField name={"description"} label={"Description"} />
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