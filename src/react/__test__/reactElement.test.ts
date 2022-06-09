import { isValidElement, createElement } from "../ReactElement";
import { REACT_ELEMENT_TYPE } from "../../shared/ReactSymbols";

test("react element, The following are invalid", () => {
  const fakeElements = [undefined, null, "", "element", 0, true, false, [], {}];
  for (let i = 0; i < fakeElements.length; i++) {
    expect(isValidElement(fakeElements[i])).toBe(false);
  }
});

// test("valid react CreateElement", () => {
//   const Hello = () => "hello";
//   const element = createElement(Hello, {}, "");
//   expect(element.key).toBe(null);
// });
