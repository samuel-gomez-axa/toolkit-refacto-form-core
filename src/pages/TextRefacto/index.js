import React, { useState, Fragment } from "react";
import Button from "@axa-fr/react-toolkit-button";
import Title from "@axa-fr/react-toolkit-title";
import {
  FieldInput,
  FieldForm,
  FieldForm2,
  FieldError,
  HelpMessage,
} from "../../refactoToolkit/form/Core";
import { Text } from "../../refactoToolkit/form/Text";
import "../Text/Text.scss";

const ERROR_MESSAGE = "champ obligatoire";
const ERROR_FORMAT = "Format error";
const TEXT = "text-custom";

const TextRefactoPage = () => {
  const [stateText, setStateText] = useState({
    hasErrors: true,
    hasSubmit: false,
    classModifier: "disabled",
    fields: {
      [TEXT]: { value: "", message: ERROR_MESSAGE },
    },
  });

  const handleChange = ({ value, name }) => {
    const isFormatError = value !== "5" ? "" : ERROR_FORMAT;
    const isEmpty = value !== "" ? "" : ERROR_MESSAGE;
    const message = isEmpty || isFormatError;
    console.log(message, !!message);
    const classModifier = !!message ? "disabled" : "";
    setStateText((prevState) => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStateText((prevState) => ({
      ...prevState,
      hasSubmit: true,
    }));
  };

  return (
    <Fragment>
      <Title>Version de Text avec FieldForm Refacto</Title>
      <form
        onSubmit={handleSubmit}
        className="af-form"
        id="form"
        name="form"
        autoComplete="off"
      >
        <FieldForm2
          className="row af-form__group af-form__group--required"
          message={stateText.fields[TEXT].message}
          messageType="error"
          forceDisplayMessage={stateText.hasSubmit}
        >
          <div className="col-md-12">
            <label className="af-form__group-label" htmlFor={TEXT}>
              Text
            </label>
            <FieldInput className="af-form__text af-form__text--custom">
              <Text
                id={TEXT}
                name={TEXT}
                onChange={handleChange}
                classModifier="required"
                value={stateText.fields[TEXT].value}
              />
            </FieldInput>
            <HelpMessage message="Besoin d'aide ?" />
            <FieldError
              message={stateText.fields[TEXT].message}
              messageType="error"
            />
          </div>
        </FieldForm2>

        <Button
          classModifier={stateText.classModifier}
          disabled={stateText.hasErrors}
        >
          Submit
        </Button>
      </form>
    </Fragment>
  );
};

export default TextRefactoPage;
