import { SET_ACTIVE, SET_RESTING, SET_DISABLED } from '../actions/activity';

// Method lookup pattern:
export default function actvity(state = 'active', action) {
  const handlers = {
    SET_ACTIVE: 'active',
    SET_RESTING: 'resting',
    SET_DISABLED: 'disabled',
    DEFAULT: state
  };

  if (action.type in handlers) {
    return handlers[action.type];
  }
  return handlers.DEFAULT;
}
