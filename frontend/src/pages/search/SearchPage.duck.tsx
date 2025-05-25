const initialState = {
  court: null,
};

export const ON_CHOICE_COURT = "ON_CHOICE_COURT";

export default function searchPageReducer(state = initialState, action: any) {
  switch (action.type) {
    case ON_CHOICE_COURT: {
      return { ...state, court: action.payload };
    }
  }
}

export const onChoiceCourt = (court: any) => ({
  type: ON_CHOICE_COURT,
  payload: court,
});