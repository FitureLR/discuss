import version from "../shared/version";
import { useState } from "./ReactHooks";
import { createElement, isValidElement, createFactory } from "./ReactElement";

const React = {
  version,

  // hooks
  useState,

  // reactElement
  isValidElement,
  createElement,

  // To be Discard
  createFactory,
};

export default React;
