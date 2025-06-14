import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'artir':
      return { count: state.count + 1 };
    case 'azalt':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <h2>{state.count}</h2>
      <button onClick={() => dispatch({ type: 'artir' })}>+</button>
      <button onClick={() => dispatch({ type: 'azalt' })}>-</button>
    </div>
  );
}
