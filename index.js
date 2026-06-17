/**
 * index.js
 * CLI entry point for the calculator.
 *
 * Usage:
 *   1) One-shot mode:   node index.js 5 + 3
 *   2) Interactive mode: node index.js   (then follow the prompts)
 */

const readline = require("readline");
const { calculate } = require("./calculator");

const args = process.argv.slice(2);

function runOneShot(a, operator, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    console.error("Error: both operands must be valid numbers.");
    process.exit(1);
  }

  try {
    const result = calculate(operator, numA, numB);
    console.log(`${numA} ${operator} ${numB} = ${result}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("=== Simple Calculator ===");
  console.log("Supported operators: + - * /");
  console.log("Type 'exit' at any prompt to quit.\n");

  function ask() {
    rl.question("Enter first number: ", (aInput) => {
      if (aInput.trim().toLowerCase() === "exit") return rl.close();

      rl.question("Enter operator (+, -, *, /): ", (opInput) => {
        if (opInput.trim().toLowerCase() === "exit") return rl.close();

        rl.question("Enter second number: ", (bInput) => {
          if (bInput.trim().toLowerCase() === "exit") return rl.close();

          const a = parseFloat(aInput);
          const b = parseFloat(bInput);
          const operator = opInput.trim();

          if (Number.isNaN(a) || Number.isNaN(b)) {
            console.log("Invalid number entered. Please try again.\n");
            return ask();
          }

          try {
            const result = calculate(operator, a, b);
            console.log(`Result: ${a} ${operator} ${b} = ${result}\n`);
          } catch (err) {
            console.log(`Error: ${err.message}\n`);
          }

          ask();
        });
      });
    });
  }

  ask();

  rl.on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });
}

if (args.length === 3) {
  runOneShot(args[0], args[1], args[2]);
} else if (args.length === 0) {
  runInteractive();
} else {
  console.log("Usage:");
  console.log("  node index.js <num1> <operator> <num2>   (one-shot)");
  console.log("  node index.js                            (interactive mode)");
  process.exit(1);
}
