import React, {FC, useMemo} from "react";
import Select, {OptionsType, StylesConfig, ValueType} from "react-select";
import chroma from 'chroma-js';
import {useField} from "formik";

interface Option {
  label: string
  value: string
  color?: string
}

interface CustomSelectProps {
  options: OptionsType<Option>
  isMulti?: boolean
  placeholder?: string
  name: string
  clearable?: boolean
}

const SelectTagField: FC<CustomSelectProps> = ({placeholder, options, isMulti = false, name, clearable= false}) => {
  const [field, meta, helpers] = useField(name)

  const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const styles = useMemo((): StylesConfig => ({
    option: (provided, {data, isFocused, isSelected}) => {
      const color = chroma(data.color);
      if (!data.color) {
        return {...provided}
      }

      return {
        ...provided,
        backgroundColor: isSelected
          ? data.color
          : isFocused
            ? color.alpha(0.1).css()
            : null,
        color: isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
      }
    },
    input: styles => ({...styles, ...dot()}),
    placeholder: styles => ({...styles, ...dot()}),
    singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
  }), [])

  const getValue = () => {
    if (options) {
      if (isMulti) {
        const r = options.filter(option => field.value.indexOf(option.value) >= 0)
        if (r) {
          return r
        }
      } else {
        const r = options.find(option => option.value === field.value);
        if (r) {
          return r
        }
      }

      return null
    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  const onChange = (option: ValueType<Option | Option[]>) => {
    if (!option) {
      helpers.setValue("")
      return
    }
    helpers.setValue(
      isMulti
        ? (option as Option[]).map((item: Option) => item.value)
        : (option as Option).value
    );
  };

  const showErrMsg = () => {
    return meta.touched && meta.error ? <p className={"error-msg"}>{meta.error}</p> : null
  }

  return (
    <div className={"select-wrapper"}>
      <Select
        classNamePrefix={"sel"}
        options={options}
        value={getValue()}
        styles={styles}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        onBlur={field.onBlur}
        isClearable={clearable}
      />
      {showErrMsg()}
    </div>
  )
}

export default SelectTagField;