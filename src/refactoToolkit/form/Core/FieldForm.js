import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ClassManager } from "@axa-fr/react-toolkit-core";
import MessageTypes from "./MessageTypes";

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

        return child.type.Clone
          ? child.type.Clone({
              props,
              messageType,
              message,
              child,
              wrapper,
            })
          : React.cloneElement(child, props);
      });

export default FieldForm;
