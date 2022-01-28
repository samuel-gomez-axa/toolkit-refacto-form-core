import React from "react";
import PropTypes from "prop-types";
import { CLONES } from "./FieldForm2";

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
HelpMessage.Clone = CLONES.CLONE_HELP_MESSAGE;

export default HelpMessage;
