/**
 * script.js
 * Client-side state machine for the calculator UI.
 * Binary operations (+ - * /) are sent to the Node/Express
 * backend (POST /api/calculate), which reuses calculator.js —
 * the same module the CLI version uses.
 */

(function () {
  const historyEl = document.getElementById("history");
  const resultEl = document.getElementById("result");
  const statusEl = document.getElementById("status");
  const keysEl = document.querySelector(".keys");

  const OP_SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  let currentInput = "0";
  let previousValue = null;
  let operator = null;
  let overwrite = true;

  function render() {
    resultEl.textContent = currentInput;
  }

  function setHistory(text) {
    historyEl.textContent = text || "\u00A0";
  }

  function setStatus(text) {
    statusEl.textContent = text || "\u00A0";
  }

  function resetAll() {
    currentInput = "0";
    previousValue = null;
    operator = null;
    overwrite = true;
    setHistory("");
    setStatus("");
    render();
  }

  function inputDigit(digit) {
    setStatus("");
    if (overwrite) {
      currentInput = digit;
      overwrite = false;
    } else {
      // Avoid runaway display length
      if (currentInput.replace("-", "").replace(".", "").length >= 14) return;
      currentInput = currentInput === "0" ? digit : currentInput + digit;
    }
    render();
  }

  function inputDecimal() {
    setStatus("");
    if (overwrite) {
      currentInput = "0.";
      overwrite = false;
      render();
      return;
    }
    if (!currentInput.includes(".")) {
      currentInput += ".";
      render();
    }
  }

  function backspace() {
    setStatus("");
    if (overwrite) return;
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "" || currentInput === "-") currentInput = "0";
    if (currentInput === "0") overwrite = true;
    render();
  }

  function percent() {
    setStatus("");
    const value = parseFloat(currentInput) / 100;
    currentInput = String(value);
    overwrite = true;
    render();
  }

  async function callBackend(a, op, b) {
    const res = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a, operator: op, b }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Calculation failed.");
    }
    return data.result;
  }

  async function setOperator(nextOp) {
    setStatus("");
    const value = parseFloat(currentInput);

    if (operator && !overwrite) {
      // There's a pending operation and a freshly typed second number:
      // resolve it first, then queue the new operator.
      try {
        const result = await callBackend(previousValue, operator, value);
        previousValue = result;
        currentInput = String(result);
        render();
      } catch (err) {
        setStatus(err.message);
        return;
      }
    } else if (previousValue === null) {
      previousValue = value;
    }

    operator = nextOp;
    overwrite = true;
    setHistory(`${trimZero(previousValue)} ${OP_SYMBOLS[operator]}`);
  }

  async function equals() {
    if (operator === null || previousValue === null) return;
    setStatus("");
    const value = parseFloat(currentInput);

    try {
      const result = await callBackend(previousValue, operator, value);
      setHistory(`${trimZero(previousValue)} ${OP_SYMBOLS[operator]} ${trimZero(value)} =`);
      currentInput = String(result);
      previousValue = null;
      operator = null;
      overwrite = true;
      render();
    } catch (err) {
      setStatus(err.message);
    }
  }

  function trimZero(n) {
    return Number(n).toString();
  }

  keysEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".key");
    if (!btn) return;

    const { digit, operator: op, action } = btn.dataset;

    if (digit !== undefined) {
      inputDigit(digit);
    } else if (op !== undefined) {
      setOperator(op);
    } else if (action === "decimal") {
      inputDecimal();
    } else if (action === "clear") {
      resetAll();
    } else if (action === "backspace") {
      backspace();
    } else if (action === "percent") {
      percent();
    } else if (action === "equals") {
      equals();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
      inputDigit(e.key);
    } else if (e.key === ".") {
      inputDecimal();
    } else if (["+", "-", "*", "/"].includes(e.key)) {
      setOperator(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      equals();
    } else if (e.key === "Backspace") {
      backspace();
    } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
      resetAll();
    } else if (e.key === "%") {
      percent();
    }
  });

  render();
})();
