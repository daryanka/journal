import React, {forwardRef, ForwardRefExoticComponent, useImperativeHandle} from "react";
import ReactDOM from "react-dom";

export interface modalOptionsI {
  open: () => void
  close: () => void
}

const Modal: ForwardRefExoticComponent<any> = forwardRef((props, ref) => {
  const [display, setDisplay] = React.useState(false);

  useImperativeHandle(ref, () => {
    return {
      open: show,
      close: hide
    }
  })

  const show = () => {
    setDisplay(true)
  };

  const hide = () => {
    setDisplay(false)
  };

  const content = (
    <div className={"modal-wrapper"}>
      <div onClick={hide} className={"modal-backdrop"} />
      <div className={"modal-content"}>
        {props.children}
      </div>
    </div>
  );

  if (display) {
    return ReactDOM.createPortal(content, document.getElementById("modal-root") as Element)
  }

  return null;

});

export default Modal