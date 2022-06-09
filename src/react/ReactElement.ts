/* snip */

import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";
import hasOwnProperty from "../shared/hasOwnProperty";
import { checkKeyStringCoercion } from "../shared/CheckStringCoercion";
import ReactCurrentOwner from "./ReactCurrentOwner";

// config 参数中的保留属性, 但实际我们使用的 ...reset 过滤掉了，所以没有使用这个对象去判断并进行筛选.
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

/*
  Factory method to create a new React element. This no longer adheres to
  the class pattern, so do not use new to call it. Also, instanceof check
  will not work. Instead test $$typeof field against Symbol.for('react.element') to check
  if something is a React Element.
*/
const ReactElement = (type, key, ref, self, source, owner, props) => {
  const element: ReactElement = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };
  // @ts-ignore
  if (__DEV__) {
    // UNKNOWN 这几个属性用来做什么的
    element._store = {};
    element._self = self;
    element._source = source;
    Object.freeze && Object.freeze(element) && Object.freeze(element.props);
  }
  return element;
};

/* Create and return a new ReactElement of the given type. */
export function createElement(type, config, children) {
  let _ref = null;
  let _key = null;
  let _source = null;
  let _self = null;
  let propName = "";
  // Reserved names are extracted
  const props: ElementProps = {} as ElementProps;
  if (config) {
    const { ref, key, __self, __source, ...reset } = config;
    if (hasValidConfigKey(config, "ref")) {
      _ref = ref;
      // @ts-ignore
      // __DEV__ && warnIfStringRefCannotBeAutoConverted(config); // 验证ref是否为string？
    }
    if (hasValidConfigKey(config, "key")) {
      _key = "" + key;
      // @ts-ignore
      __DEV__ && checkKeyStringCoercion(config.key);
    }
    _source = __source !== undefined ? __source : null;
    _self = __self !== undefined ? __self : null;
    // Remaining properties are added to a new props object
    for (propName in reset) {
      if (hasOwnProperty.call(config, propName)) {
        props[propName] = config[propName];
      }
    }
  }
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = new Array(childrenLength);
    for (let index = 0; index < childrenLength; index++) {
      childArray[index] = arguments[index + 2];
    }
    //@ts-ignore
    __DEV__ && typeof Object.freeze === "function" && Object.freeze(childArray);
    props.children = childArray;
  }
  // Resolve default props // TIP 很有历史感
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      // AMAZING 这里有效防止将key ref设置为props属性
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  // @ts-ignore
  if (__DEV__ && (_key || _ref)) {
    const isFunc = type === "function";
    const name = isFunc ? type.displayName || type.name || "Unknown" : type;
    // 访问 props 的 key 和 ref 发错警告
    // (props.key) 并且这个访问获取不到值,因为props上不会有element的内置属性 key 和 props.
    _key && definePropWarningGetter(props, name, "key");
    _ref && definePropWarningGetter(props, name, "ref");
  }
  return ReactElement(
    type,
    _key,
    _ref,
    _self,
    _source,
    ReactCurrentOwner.current,
    props
  );
}

/* Return a function that produces ReactElements of a given type. */
export function createFactory(type) {
  // 暴露一个 type 属性，可以尽早地知道 element 的 type. E.g. `<Foo />.type === Foo`.
  const factory = createElement.bind(null, type);
  factory.type = type;
  // Legacy hook: remove it
  return factory;
}

/* Clone and return a new ReactElement using element as the starting point. */
export function cloneElement(element, config, children) {
  if (element === null || element === undefined) throw new Error("...");
  // Original props are copied
  const props = Object.assign({}, element.props);
  // ...
}

/*
  RFC
  例如 children 始终通过 props 来传递. key 放到 props 外面单独传递 ... 提议
  https://github.com/reactjs/rfcs/pull/107
*/
export function jsx(type, config, maybeKey) {}
export function jsxDEV(type, config, maybeKey, source, self) {}

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 */
export function isValidElement(object) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}

/* Valid ref|key for config */
export function hasValidConfigKey(config, key) {
  // @ts-ignore
  if (__DEV__) {
    if (hasOwnProperty.call(config, "ref")) {
      const getter = Object.getOwnPropertyDescriptor(config, "ref").get;
      if (getter && (getter as any).isReactWarning) {
        return false;
      }
    }
  }
  return config[key] !== undefined;
}

const warningShown = {
  key: "specialPropKeyWarningShown",
  ref: "specialPropRefWarningShown",
  string_ref: "didWarnAboutStringRefs",
};

function definePropWarningGetter(props, displayName, key) {
  const warnAboutAccessingKey = function () {
    // @ts-ignore
    if (__DEV__) {
      if (!warningShown[key]) {
        warningShown[key] = true;
        console.error(
          `%s: "${key}" is not a prop. Trying to access it will result " +
            "in undefined being returned. If you need to access the same " +
            "value within the child component, you should pass it as a different " +
            "prop. (https://reactjs.org/link/special-props)`,
          displayName
        );
      }
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, "key", {
    get: warnAboutAccessingKey,
    configurable: true,
  });
}
