import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ClassManager } from "@axa-fr/react-toolkit-core";
import MessageTypes from "./MessageTypes";
import FormClassManager from "./FormClassManager";

const CLONE_INPUT = "input";
const CLONE_INPUT_LIST = "inputlist";
const CLONE_FIELD_ERROR = "fielderror";
const CLONE_HELP_MESSAGE = "helpmessage";
const CLONE_FIELD_INPUT = "fieldinput";

export const CLONES = {
  CLONE_INPUT,
  CLONE_INPUT_LIST,
  CLONE_FIELD_ERROR,
  CLONE_HELP_MESSAGE,
  CLONE_FIELD_INPUT,
};

const defaultClassName = "md-10";

const INITIAL_STATE = {
  hasLostFocusOnce: false,
  hasFocus: false,
  hasChange: false,
  memory: { message: "", messageType: "" },
};

export const FieldForm = (props) => {
  const {
    message,
    messageType,
    children,
    className,
    classModifier,
    forceDisplayMessage,
  } = props;
  const [state, setState] = useState(INITIAL_STATE);
  const { hasChange } = state;

  const previousForceDisplayMessage = useRef(forceDisplayMessage);

  useEffect(() => {
    if (previousForceDisplayMessage.current !== forceDisplayMessage) {
      setState((prevState) => ({
        ...prevState,
        memory: {
          message,
          messageType,
        },
      }));
    }
  }, [forceDisplayMessage, message, messageType]);

  const onChange = () => {
    // for particular case on particular browers which does not throw onFocus or onBlur event
    if (!hasChange) {
      setState((prevState) => ({ ...prevState, hasChange: true }));
    }
  };

  const onBlur = () =>
    setState((prevState) => ({
      ...prevState,
      hasLostFocusOnce: true,
      hasFocus: false,
    }));

  const onFocus = () =>
    setState((prevState) => ({
      ...prevState,
      hasFocus: true,
      memory: { message, messageType },
    }));

  const childrenCloned = renderedChildren({
    children,
    wrapper: { onFocus, onChange, onBlur },
    ...getInfo({ ...state, ...props }),
  });

  const subComponentClassName = ClassManager.getComponentClassName(
    className,
    classModifier,
    defaultClassName,
  );

  return <div className={subComponentClassName}>{childrenCloned}</div>;
};

FieldForm.propTypes = {
  children: PropTypes.node.isRequired,
  forceDisplayMessage: PropTypes.bool,
  message: PropTypes.string,
  messageType: PropTypes.string,
  className: PropTypes.string,
  classModifier: PropTypes.string,
};

FieldForm.defaultProps = {
  forceDisplayMessage: false,
  message: null,
  messageType: MessageTypes.error,
  className: defaultClassName,
  classModifier: null,
};

export const getInfo = ({
  forceDisplayMessage,
  hasLostFocusOnce,
  hasFocus,
  memory,
  hasChange,
  message,
  messageType,
}) => {
  const isDisplayMessage =
    hasLostFocusOnce || forceDisplayMessage || (hasChange && !hasFocus);

  if (!isDisplayMessage) {
    return {
      message: "",
      messageType: "",
    };
  }
  return hasFocus
    ? memory
    : {
        message,
        messageType,
      };
};

export const renderedChildren = ({ children, wrapper, message, messageType }) =>
  !children
    ? null
    : React.Children.map(children, (child) => {
        // create a copy that includes additional property values as needed

        if (!child || !child.props || !child.type) {
          return child;
        }

        const props = {
          ...child.props,
        };

        if (child.props.children) {
          const subChildren = renderedChildren({
            children: child.props.children,
            wrapper,
            message,
            messageType,
          });

          if (subChildren !== null) {
            props.children = subChildren;
          }
        }

        return React.cloneElement(child, {
          ...props,
          ...addPropsClone({
            clone: child.type.Clone,
            message,
            messageType,
            props,
            wrapper,
            child,
          }),
        });
      });

export default FieldForm;

const addPropsClone = ({
  clone,
  message,
  messageType,
  props,
  wrapper,
  child,
}) => {
  const classModifier = FormClassManager.getMessageClassModifier(
    messageType,
    message,
    props.classModifier,
  );

  switch (clone) {
    case CLONES.CLONE_HELP_MESSAGE:
      return { isVisible: !message };
    case CLONES.CLONE_FIELD_ERROR:
      return { message };
    case CLONES.CLONE_FIELD_INPUT:
      return { classModifier };
    case CLONES.CLONE_INPUT:
      return { ...eventWrapper(wrapper, child.props) };
    case CLONES.CLONE_INPUT_LIST:
      return { ...eventWrapper(wrapper, child.props), classModifier };
    default:
      return {};
  }
};

const eventWrapper = (wrapper, props) => ({
  onChange: (ev) => {
    wrapper.onChange(ev);
    if (props.onChange) {
      props.onChange(ev);
    }
  },
  onBlur: (ev) => {
    wrapper.onBlur(ev);
    if (props.onBlur) {
      props.onBlur(ev);
    }
  },
  onFocus: (ev) => {
    wrapper.onFocus(ev);
    if (props.onFocus) {
      props.onFocus(ev);
    }
  },
});
