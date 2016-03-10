import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';

export default function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    default:
      return state;
  }
}

// // Method lookup pattern:
// export default function counter(state = 0, action) {
//   const handler = {
//     INCREMENT_COUNTER: state + 1,
//     DECREMENT_COUNTER: state - 1,
//     DEFAULT: state
//   };
//
//   if (action.type in handler) {
//     return handler[action.type];
//   }
//   return handler.DEFAULT;
// }
