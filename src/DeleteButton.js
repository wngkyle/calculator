import { ACTIONS } from "./App";

export default function DeleteButton({ dispatch }) {
    return <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>
        DEL
    </button>
}