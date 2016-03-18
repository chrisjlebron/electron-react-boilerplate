import { SET_ACTIVE, SET_RESTING, SET_DISABLED } from '../actions/activity';

// Method lookup pattern:
export default function actvity(state = {}, action) {
  const handlers = {
    SET_ACTIVE: state + 1,
    SET_RESTING: state - 1,
    SET_DISABLED: state,
    DEFAULT: state
  };

  if (action.type in handlers) {
    return handlers[action.type];
  }
  return handlers.DEFAULT;
}
