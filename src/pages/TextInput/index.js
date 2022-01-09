import React, { useState, Fragment } from "react";
import Button from "@axa-fr/react-toolkit-button";
import Title from "@axa-fr/react-toolkit-title";
import { TextInput } from "@axa-fr/react-toolkit-form-input-text";

const ERROR_MESSAGE = "champ obligatoire";
const TEXT_INPUT = "text-input";

const TextInputPage = () => {
  const [stateInputText, setStateInputText] = useState({
    hasErrors: true,
    classModifier: "disabled",
    fields: {
      [TEXT_INPUT]: { value: "", message: ERROR_MESSAGE },
    },
  });

  const handleChange = ({ value, name }) => {
    const message = value !== "" ? "" : ERROR_MESSAGE;
    const classModifier = value !== "" ? "" : "disabled";
    setStateInputText((prevState) => ({
      ...prevState,
      hasErrors: !!message,
      classModifier,
      fields: {
        ...prevState.fields,
        [name]: {
          ...prevState.fields[name],
          value,
          message,
        },
      },
    }));
  };

  return (
    <Fragment>
      <Title>Version de TextInput 1.4.1</Title>
      <form className="af-form" id="form" name="form" autoComplete="off">
        <TextInput
          label="TextInput"
          id={TEXT_INPUT}
          name={TEXT_INPUT}
          onChange={handleChange}
          classModifier="required"
          {...stateInputText.fields[TEXT_INPUT]}
          helpMessage="Want help ?"
        />
        <Button
          classModifier={stateInputText.classModifier}
          disabled={stateInputText.hasErrors}
        >
          Submit
        </Button>
      </form>
    </Fragment>
  );
};

export default TextInputPage;
