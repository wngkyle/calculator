import { ACTIONS } from "./App";

export default function EqualButton({ dispatch }) {
    return <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
    </button>
}