import React from "./react";

const setShowInfo = () => {
  const root = document.getElementById("root");
  const container = document.createElement("div");

  container.innerText = React.version;
  root.appendChild(container);
};

const printTarget = () => {
  // const config = {
  //   key: "10",
  //   ref: "90",
  //   name: "hello",
  // };
  const config = "";
  const type = () => "100";
  type.defaultProps = {
    name: "Jack",
    age: 10,
  };
  const element = React.createElement(type, config, undefined);
  console.log("element", element, element.key, element.props.children);
};

const main = () => {
  // @ts-ignore
  if (__DEV__) {
    console.log("IN DEV");
  }
  printTarget();
  // setShowInfo();
};

document.onreadystatechange = () => {
  document.readyState === "interactive" && main();
};
