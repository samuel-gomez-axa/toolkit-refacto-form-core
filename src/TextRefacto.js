import React, { useState, Fragment } from "react";
import Button from "@axa-fr/react-toolkit-button";
import Title from "@axa-fr/react-toolkit-title";
import {
  FieldInput,
  FieldForm,
  FieldError
} from "@axa-fr/react-toolkit-form-core";
import { Text } from "@axa-fr/react-toolkit-form-input-text";
import "./Text.scss";

const ERROR_MESSAGE = "champ obligatoire";
const TEXT = "text-custom";

const TextRefactoPage = () => {
  const [stateText, setStateText] = useState({
    hasErrors: true,
    hasSubmit: false,
    classModifier: "disabled",
    fields: {
      [TEXT]: { value: "", message: ERROR_MESSAGE }
    }
  });

  const handleChange = ({ value, name }) => {
    const message = value !== "" ? "" : ERROR_MESSAGE;
    const classModifier = value !== "" ? "" : "disabled";
    setStateText((prevState) => ({
      ...prevState,
      hasErrors: !!message,
      classModifier,
      fields: {
        ...prevState.fields,
        [name]: {
          ...prevState.fields[name],
          value,
          message
        }
      }
    }));
  };

  return (
    <Fragment>
      <Title>Version de Text 1.4.1</Title>
      <form className="af-form" id="form" name="form" autoComplete="off">
        <FieldForm
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
            <FieldError
              message={stateText.fields[TEXT].message}
              messageType="error"
            />
          </div>
        </FieldForm>

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
