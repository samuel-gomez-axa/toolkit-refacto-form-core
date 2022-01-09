import React, { Fragment } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import TextInputPage from "../pages/TextInput";
import TextPage from "../pages/Text";
import TextRefactoPage from "../pages/TextRefacto";
import "./App.scss";

const Nav = () => (
  <nav className="container">
    <NavLink to="/">TextInput</NavLink>
    <NavLink to="/text">Text</NavLink>
    <NavLink to="/text-refacto">Text Refacto</NavLink>
  </nav>
);

const App = () => {
  return (
    <Fragment>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<TextInputPage />} />
          <Route path="/text" element={<TextPage />} />
          <Route path="/text-refacto" element={<TextRefactoPage />} />
        </Routes>
      </main>
    </Fragment>
  );
};

export default App;
