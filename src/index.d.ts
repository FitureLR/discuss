type mixed = any; // temporary
type ElementProps = {
  // key?: string;
  // ref?: any;
  children: any; // temporary
};
/****** React ******/

/* ReactCurrentDispatcher */
type ReactCurrentDispatcher = {
  current: null | Dispatcher;
};

/* ReactCurrentOwner */
type ReactCurrentOwner = {
  current: null | Fiber;
};

/* ReactElement */
type ReactElement = {
  $$typeof: string | Symbol;
  props: ElementProps;
  type: any; // temporary
  ref: any;
  key: string;
  _owner: ReactElement;
  // other
  _store?: any;
  _self?: any;
  _source?: any;
};

/* ReactHooks */
type InitialState<S> = (() => S) | S;
type Dispatch<A> = (A) => void;
type BasicStateAction<S> = InitialState<S>;

/****** Reconciler ******/
/* ReactInternalTypes */
type Dispatcher = {
  useState: (state: any) => any;
};

type Fiber = {
  tag: string; // temporary
};
