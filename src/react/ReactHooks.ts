import ReactCurrentDispatcher from "./ReactCurrentDispatcher";

const resolveDispatcher = () => {
  const dispatcher = ReactCurrentDispatcher.current;
  // @ts-ignore
  if (__DEV__) {
    console.warn("Invalid hook call. ...");
  }
  return dispatcher;
};

export function useState<S>(
  initialState: InitialState<S>
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
