const previousDisplay = document.querySelector("#previous-display");
const currentDisplay = document.querySelector("#current-display");
const buttons = document.querySelectorAll("button");

let currentValue = "0";
let previousValue = "";
let selectedOperator = null;
let shouldResetDisplay = false;

const operatorSymbols = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
  "%": "%",
};

function updateDisplay() {
  currentDisplay.textContent = currentValue;
  previousDisplay.textContent =
    previousValue && selectedOperator
      ? `${previousValue} ${operatorSymbols[selectedOperator]}`
      : "";
}

function appendNumber(number) {
  if (number === "." && currentValue.includes(".")) {
    return;
  }

  if (currentValue === "0" || shouldResetDisplay) {
    currentValue = number === "." ? "0." : number;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  currentValue += number;
  updateDisplay();
}

function chooseOperator(operator) {
  if (selectedOperator && !shouldResetDisplay) {
    calculate();
  }

  previousValue = currentValue;
  selectedOperator = operator;
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate() {
  const previous = Number(previousValue);
  const current = Number(currentValue);

  if (!selectedOperator || !Number.isFinite(previous) || !Number.isFinite(current)) {
    return;
  }

  let result;

  if (selectedOperator === "+") {
    result = previous + current;
  } else if (selectedOperator === "-") {
    result = previous - current;
  } else if (selectedOperator === "*") {
    result = previous * current;
  } else if (selectedOperator === "/") {
    if (current === 0) {
      currentValue = "Cannot divide by 0";
      previousValue = "";
      selectedOperator = null;
      shouldResetDisplay = true;
      updateDisplay();
      return;
    }

    result = previous / current;
  } else if (selectedOperator === "%") {
    result = previous % current;
  }

  currentValue = formatResult(result);
  previousValue = "";
  selectedOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function formatResult(number) {
  if (!Number.isFinite(number)) {
    return "Error";
  }

  return Number(number.toFixed(8)).toString();
}

function clearCalculator() {
  currentValue = "0";
  previousValue = "";
  selectedOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteNumber() {
  if (shouldResetDisplay || currentValue.length === 1) {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    if (number) {
      appendNumber(number);
    } else if (operator) {
      chooseOperator(operator);
    } else if (action === "equals") {
      calculate();
    } else if (action === "clear") {
      clearCalculator();
    } else if (action === "delete") {
      deleteNumber();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    appendNumber(key);
  } else if (["+", "-", "*", "/", "%"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteNumber();
  } else if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
