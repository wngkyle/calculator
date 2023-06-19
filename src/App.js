import "./style.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import DeleteButton from "./DeleteButton";
import ClearButton from "./ClearButton";
import EqualButton from "./EqualButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return 
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      // This prevents inserting mutliple zeros into the calculator
      if (payload.digit == "0" && state.currentOperand == "0") {
        return state
      }
      // If the current operand is a zero and current payload is number not zero, change zero to that number
      // Prevents showing a zero in front of a number
      if (state.currentOperand == "0" && state.currentOperand?.length == 1 && payload.digit != ".") {
        return {
          ...state,
          currentOperand: `${payload.digit}`
        }
      }
      // The following line checks if there is a period already in the operand, if there is, just return the current state
      // This prevent the user from typing multiple periods 
      if (payload.digit == "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR: 
      return {}

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      } 
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      }

    case ACTIONS.DELETE_DIGIT: 
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(curr)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + curr
      break;
    case "-":
      computation = prev - curr
      break;
    case "×":
      computation = prev * curr
      break;
    case "÷":
      computation = prev / curr 
      break
  }
  return computation.toString()
}
 
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <ClearButton dispatch={dispatch} />
      <DeleteButton dispatch={dispatch} />
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <EqualButton dispatch={dispatch} />
    </div>
  );
}

export default App;
