import { ACTIONS } from "./App";

export default function ClearButton({ dispatch }) {
    return <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
    </button>
}