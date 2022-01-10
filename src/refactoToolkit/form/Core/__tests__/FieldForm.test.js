import React, { Fragment } from "react";
import { render, within } from "@testing-library/react";
import FieldForm, { renderedChildren, getInfo } from "../FieldForm";
import FieldError from "../FieldError";
import FieldInput from "../FieldInput";
import HelpMessage from "../HelpMessage";

const CustomWithClone = ({ label, message, ...rest }) => (
  <p {...rest}>
    {label} {message}
  </p>
);

CustomWithClone.Clone = (data) => {
  const { props, message, child } = data;
  return React.cloneElement(child, {
    ...props,
    message,
    label: "Mon message :",
  });
};

const defaultProps = {
  message: "message erreur",
  messageType: "error",
  forceDisplayMessage: false,
};

const renderFieldForm = ({
  children = "",
  props = defaultProps,
  customProps = {},
}) =>
  render(
    <FieldForm {...props} {...customProps}>
      {children}
      <FieldError message={props.message} messageType={props.messageType} />
    </FieldForm>,
  );

const expectBySelector = (container, selector, not = false) => {
  const element = container.querySelector(selector);
  not
    ? expect(element).not.toBeInTheDocument()
    : expect(element).toBeInTheDocument();
  return element;
};

const expectText = (getByText, text) =>
  expect(getByText(RegExp(text))).toBeInTheDocument();

describe("Render <FieldForm/>", () => {
  it("Should render empty children", () => {
    const { asFragment, container } = renderFieldForm({});
    expectBySelector(container, ".md-10");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render no JSX children", () => {
    const { asFragment, container, getByText } = renderFieldForm({
      children: "testtest",
    });
    expectBySelector(container, ".md-10");
    expectText(getByText, "testtest");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render simple JSX children without type.Clone", () => {
    const Custom = () => <p>Simple JSX</p>;
    const { asFragment, container, getByText } = renderFieldForm({
      children: <Custom />,
    });
    expectBySelector(container, ".md-10");
    expectText(getByText, "Simple JSX");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render custom JSX children with type.Clone and forceDisplayMessage is false", () => {
    const { asFragment, container, getByText } = renderFieldForm({
      children: <CustomWithClone />,
    });
    expectBySelector(container, ".md-10");
    expectText(getByText, "Mon message :");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render custom JSX children and display error message with type.Clone and forceDisplayMessage is true", () => {
    const { asFragment, container, getByText } = renderFieldForm({
      customProps: { forceDisplayMessage: true },
      children: <CustomWithClone />,
    });
    expectBySelector(container, ".md-10");
    expectText(getByText, "Mon message : message erreur");
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("Render <FieldForm/> with <CustomWithClone />", () => {
  it("Should render with message error displayed when forceDisplayMessage true", () => {
    const { asFragment, container, getByText } = renderFieldForm({
      customProps: { forceDisplayMessage: true },
      children: <CustomWithClone />,
    });
    expectBySelector(container, ".af-form__message--error");
    expectText(getByText, "Mon message : message erreur");
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("Render <FieldForm/> with <FieldInput />", () => {
  it("Should render with message displayed when forceDisplayMessage true", () => {
    const { asFragment, container, getByText } = renderFieldForm({
      customProps: {
        forceDisplayMessage: true,
        messageType: "success",
        message: "bravo",
      },
      children: (
        <FieldInput className="sam">
          <CustomWithClone />
        </FieldInput>
      ),
    });
    expectBySelector(container, ".af-form__message--error");
    expectBySelector(container, ".sam.sam--success");
    const fieldErrorMessage = expectBySelector(
      container,
      ".af-form__error-text",
    );
    expectText(within(fieldErrorMessage).getByText, "bravo");
    expectText(getByText, "Mon message : bravo");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render with display error message when forceDisplayMessage true", () => {
    const { asFragment, container, getByText } = renderFieldForm({
      customProps: { forceDisplayMessage: true },
      children: (
        <FieldInput className="sam">
          <CustomWithClone />
        </FieldInput>
      ),
    });
    expectBySelector(container, ".af-form__message--error");
    expectBySelector(container, ".sam.sam--error");
    const fieldErrorMessage = expectBySelector(
      container,
      ".af-form__error-text",
    );
    expectText(within(fieldErrorMessage).getByText, "message erreur");
    expectText(getByText, "Mon message : message erreur");
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("Render <FieldForm/> with <MyField />", () => {
  const MyField = (props) => (
    <input
      type="text"
      id="name"
      name="name"
      aria-label="input-name"
      {...props}
    />
  );

  const renderCompleteFieldForm = (customProps) =>
    renderFieldForm({
      customProps,
      children: (
        <Fragment>
          <FieldInput className="sam">
            <MyField />
          </FieldInput>
          <HelpMessage message="un peu d'aide ?" />
        </Fragment>
      ),
    });

  it("Should render with FieldInput and FieldError displayed and HelpMessage hidden when forceDisplayMessage true ", () => {
    const { asFragment, container, getByLabelText } = renderCompleteFieldForm({
      forceDisplayMessage: true,
    });

    expect(getByLabelText("input-name")).toBeInTheDocument();
    expectBySelector(container, ".af-form__message--error");
    expectBySelector(container, ".sam.sam--error");
    const fieldErrorMessage = expectBySelector(
      container,
      ".af-form__error-text",
    );
    expectText(within(fieldErrorMessage).getByText, "message erreur");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Should render with FieldInput and HelpMessage displayed and FieldError hidden when message is null", () => {
    const { asFragment, getByText, container, getByLabelText } =
      renderCompleteFieldForm({ message: null });
    expectBySelector(container, ".af-form__message--error", true);
    expect(getByLabelText("input-name")).toBeInTheDocument();
    expectText(getByText, "un peu d'aide ?");
    expect(asFragment()).toMatchSnapshot();
  });
});

const defaultParams = {
  children: undefined,
  wrapper: null,
  message: null,
  messageType: "",
};

describe("renderedChildren", () => {
  it("Should return null when children undefined", () => {
    const result = renderedChildren(defaultParams);
    expect(result).toBeNull();
  });

  it("Should return empty array when children []", () => {
    const result = renderedChildren({ ...defaultParams, children: [] });
    expect(result).toEqual([]);
  });

  it("Should return the same child when child has no props", () => {
    const Child = () => <p>child</p>;
    const result = renderedChildren({
      ...defaultParams,
      children: <Child />,
    });
    expect(result[0].props).toEqual({});
  });

  it("Should return the only childs with type when child has props", () => {
    const ChildWithProps = ({ className, id }) => (
      <p className={className} id={id}>
        child
      </p>
    );
    const result = renderedChildren({
      ...defaultParams,
      children: [
        null,
        undefined,
        <p>test</p>,
        <ChildWithProps className="hello" id="world" />,
        "str",
        true,
        false,
        <hr />,
        <p>{undefined}</p>,
        <p>{null}</p>,
      ],
    });

    expect(result.length).toEqual(6);
    expect(result[0].type).toEqual("p");
    expect(result[0].props).toEqual({ children: ["test"] });
    expect(result[1].props).toEqual({ className: "hello", id: "world" });
    expect(result[2]).toEqual("str");
    expect(result[3].type).toEqual("hr");
  });
});

describe("getInfo", () => {
  const memoryMessage = "memory message";
  const memoryMessageType = "memory messageType";
  const memory = {
    message: memoryMessage,
    messageType: memoryMessageType,
  };

  const message = "message erreur";
  const messageType = "error";
  it.each`
    forceDisplayMessage | hasLostFocusOnce | hasFocus | hasChange | expectedMessage  | expectedMessageType
    ${false}            | ${false}         | ${false} | ${false}  | ${""}            | ${""}
    ${false}            | ${false}         | ${false} | ${true}   | ${message}       | ${messageType}
    ${false}            | ${false}         | ${true}  | ${false}  | ${""}            | ${""}
    ${false}            | ${false}         | ${true}  | ${true}   | ${""}            | ${""}
    ${false}            | ${true}          | ${false} | ${false}  | ${message}       | ${messageType}
    ${false}            | ${true}          | ${false} | ${true}   | ${message}       | ${messageType}
    ${false}            | ${true}          | ${true}  | ${false}  | ${memoryMessage} | ${memoryMessageType}
    ${false}            | ${true}          | ${true}  | ${true}   | ${memoryMessage} | ${memoryMessageType}
    ${true}             | ${false}         | ${false} | ${false}  | ${message}       | ${messageType}
    ${true}             | ${false}         | ${false} | ${true}   | ${message}       | ${messageType}
    ${true}             | ${false}         | ${true}  | ${false}  | ${memoryMessage} | ${memoryMessageType}
    ${true}             | ${false}         | ${true}  | ${true}   | ${memoryMessage} | ${memoryMessageType}
    ${true}             | ${true}          | ${false} | ${false}  | ${message}       | ${messageType}
    ${true}             | ${true}          | ${false} | ${true}   | ${message}       | ${messageType}
    ${true}             | ${true}          | ${true}  | ${false}  | ${memoryMessage} | ${memoryMessageType}
    ${true}             | ${true}          | ${true}  | ${true}   | ${memoryMessage} | ${memoryMessageType}
  `(
    "Should return expectedMessage : '$expectedMessage' and expectedMessageType : '$expectedMessageType' when forceDisplayMessage: $forceDisplayMessage, hasLostFocusOnce: $hasLostFocusOnce, hasFocus: $hasFocus , hasChange: $hasChange",
    ({
      forceDisplayMessage,
      hasLostFocusOnce,
      hasFocus,
      hasChange,
      expectedMessage,
      expectedMessageType,
    }) => {
      expect(
        getInfo({
          forceDisplayMessage,
          hasLostFocusOnce,
          hasFocus,
          hasChange,
          memory,
          message,
          messageType,
        }),
      ).toEqual({ message: expectedMessage, messageType: expectedMessageType });
    },
  );
});
