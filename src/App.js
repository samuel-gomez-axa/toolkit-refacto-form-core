import React, { Fragment } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import TextInputPage from "./TextInput";
import TextPage from "./Text";
import "./App.scss";

const Nav = () => (
  <nav>
    <NavLink to="/">TextInput</NavLink>
    <NavLink to="/text">Text</NavLink>
  </nav>
);

const App = () => {
  return (
    <Fragment>
      <Nav />
      <Routes>
        <Route path="/" element={<TextInputPage />} />
        <Route path="/text" element={<TextPage />} />
      </Routes>
    </Fragment>
  );
};

export default App;
