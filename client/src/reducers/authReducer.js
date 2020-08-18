const INITIAL_STATE = {
  email: "",
  password: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_AUTH":
      return { ...state, [action.payload.field]: action.payload.value };
    default:
      return state;
  }
};
