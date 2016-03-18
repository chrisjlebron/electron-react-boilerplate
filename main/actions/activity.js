export const SET_ACTIVE = 'SET_ACTIVE';
export const SET_RESTING = 'SET_RESTING';
export const SET_DISABLED = 'SET_DISABLED';

export function setActive() {
  return {
    type: SET_ACTIVE
  };
}

export function setResting() {
  return {
    type: SET_RESTING
  };
}

export function setDisabled() {
  return {
    type: SET_DISABLED
  };
}

// export function incrementIfOdd() {
//   return (dispatch, getState) => {
//     const { counter } = getState();
//
//     if (counter % 2 === 0) {
//       return;
//     }
//
//     dispatch(increment());
//   };
// }
//
// export function incrementAsync(delay = 1000) {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(increment());
//     }, delay);
//   };
// }
