import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers";

let initialState = {};
let middleware = [thunk];
const composer =
  process.env.NODE_ENV === "development" ? composeWithDevTools : compose;
const store = createStore(
  reducers,
  initialState,
  composer(applyMiddleware(...middleware))
);

export default store;
