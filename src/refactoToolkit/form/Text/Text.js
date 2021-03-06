import React from "react";
import PropTypes from "prop-types";

import { withInput, omit } from "../Core/withInput";

const omitProperties = omit(["classModifier", "className", "isVisible"]);

const Text = (props) => {
  const {
    componentClassName,
    value,
    id,
    name,
    onFocus,
    onBlur,
    readOnly,
    disabled,
    placeholder,
    inputRef,
    onChange,
    ...otherProps
  } = props;

  return (
    <input
      className={componentClassName}
      name={name}
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
      ref={inputRef}
      {...omitProperties(otherProps)}
    />
  );
};

const defaultClassName = "af-form__input-text";
const propTypes = {
  value: PropTypes.string,
};
const defaultProps = {
  value: "",
  className: defaultClassName,
};

const EnhancedComponent = withInput(
  defaultClassName,
  propTypes,
  defaultProps,
)(Text);

EnhancedComponent.ContainerClassName = "af-form__text";
EnhancedComponent.displayName = Text.name;

export default EnhancedComponent;
