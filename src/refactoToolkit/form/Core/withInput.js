import React from "react";
import { ClassManager } from "@axa-fr/react-toolkit-core";
import Constants from "./InputConstants";

export const omit = (keys) => (props) => {
  if (!keys) {
    return props;
  }
  const clonedProps = { ...props };
  keys.forEach((element) => {
    if (element in clonedProps) {
      delete clonedProps[element];
    }
  });
  return clonedProps;
};

const defaultOnChange =
  ({ name, onChange }) =>
  (e) =>
    onChange({ value: e.target.value, name, id: e.target.id });

export const withInput =
  (
    defaultClassName,
    addPropTypes = {},
    addDefaultProps = {},
    withHandlersOverride = {},
    withPropsOverride = null,
  ) =>
  (Component) => {
    let defaultWithProps = ({ className, classModifier }) => ({
      componentClassName: ClassManager.getComponentClassName(
        className,
        classModifier,
        defaultClassName,
      ),
    });
    if (withPropsOverride) {
      defaultWithProps = withPropsOverride;
    }

    const handlers = {
      onChange: defaultOnChange,
      ...withHandlersOverride,
    };

    const EnhancedInput = (props) => {
      const { isVisible } = props;
      if (!isVisible) {
        return null;
      }
      const onHandlers = {};
      // eslint-disable-next-line guard-for-in
      for (const propertyName in handlers) {
        onHandlers[propertyName] = handlers[propertyName](props);
      }
      return (
        <Component {...props} {...defaultWithProps(props)} {...onHandlers} />
      );
    };

    const propTypes = {
      ...Constants.propTypes,
      ...addPropTypes,
    };
    EnhancedInput.propTypes = propTypes;

    const defaultProps = {
      ...Constants.defaultProps,
      ...addDefaultProps,
    };
    EnhancedInput.defaultProps = defaultProps;

    return EnhancedInput;
  };
