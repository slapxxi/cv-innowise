import { useReducer } from 'react';

type Action<TContext> =
  | { type: 'add' }
  | { type: 'cancel' }
  | { type: 'delete'; context?: TContext }
  | { type: 'update'; context: TContext };

type State<TContext> = {
  status: 'idle' | 'adding' | 'updating' | 'deleting';
  context?: TContext;
};

function routeReducer<TContext = null>(state: State<TContext>, action: Action<TContext>): State<TContext> {
  if (action.type === 'cancel') {
    return { ...state, status: 'idle' };
  }

  switch (state.status) {
    case 'idle':
      if (action.type === 'add') {
        return { ...state, status: 'adding' };
      }
      if (action.type === 'delete') {
        return { ...state, status: 'deleting', context: action.context };
      }
      if (action.type === 'update') {
        return { ...state, status: 'updating', context: action.context };
      }
      return state;
    default:
      return state;
  }
}

export function useEditingState<TContext = null>() {
  const [state, send] = useReducer(routeReducer<TContext>, { status: 'idle' });

  function add() {
    send({ type: 'add' });
  }

  function update(context: TContext) {
    send({ type: 'update', context });
  }

  function del(context?: TContext) {
    send({ type: 'delete', context });
  }

  function cancel() {
    send({ type: 'cancel' });
  }

  return { state, send, add, update, del, cancel };
}
