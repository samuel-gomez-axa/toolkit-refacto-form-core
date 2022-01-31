import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  message: PropTypes.string,
  isVisible: PropTypes.bool,
};

const defaultProps = {
  message: null,
  isVisible: true,
};

const HelpMessage = ({ message, isVisible }) => {
  if (isVisible) {
    return <small className="af-form__help">{message}</small>;
  }
  return null;
};

HelpMessage.propTypes = propTypes;
HelpMessage.defaultProps = defaultProps;

export default HelpMessage;
