const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const historyList = document.getElementById("historyList");
const copyBtn = document.getElementById("copyBtn");
const clearHistoryBtn = document.getElementById("clearHistory");

let expression = "";
let history = [];

function updateDisplay(value) {
    display.value = value || "0";
}

function addHistory(exp, result) {
    if (history.length === 0) {
        historyList.innerHTML = "";
    }

    history.unshift(`${exp} = ${result}`);

    if (history.length > 10) {
        history.pop();
    }

    historyList.innerHTML = "";

    history.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        switch (value) {
            case "AC":
                expression = "";
                updateDisplay(expression);
                break;

            case "⌫":
                expression = expression.slice(0, -1);
                updateDisplay(expression);
                break;

            case "=":
                if (expression === "") return;

                try {
                    const oldExp = expression;
                    const result = eval(expression);

                    expression = result.toString();
                    updateDisplay(expression);

                    addHistory(oldExp, result);

                } catch {
                    expression = "";
                    updateDisplay("Error");
                }
                break;

            case "%":
                try {
                    expression = (eval(expression) / 100).toString();
                    updateDisplay(expression);
                } catch {
                    expression = "";
                    updateDisplay("Error");
                }
                break;

            default:
                expression += value;
                updateDisplay(expression);
        }
    });
});

document.addEventListener("keydown", (e) => {

    const key = e.key;

    if ("0123456789+-*/.".includes(key)) {
        expression += key;
        updateDisplay(expression);
    }

    if (key === "Enter") {
        e.preventDefault();

        try {
            if (expression === "") return;

            const oldExp = expression;
            const result = eval(expression);

            expression = result.toString();
            updateDisplay(expression);

            addHistory(oldExp, result);

        } catch {
            expression = "";
            updateDisplay("Error");
        }
    }

    if (key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay(expression);
    }

    if (key === "Escape") {
        expression = "";
        updateDisplay(expression);
    }

    if (key === "%") {
        try {
            expression = (eval(expression) / 100).toString();
            updateDisplay(expression);
        } catch {
            expression = "";
            updateDisplay("Error");
        }
    }
});

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(display.value);

        copyBtn.textContent = "✅";

        setTimeout(() => {
            copyBtn.textContent = "📋";
        }, 1500);

    } catch {
        alert("Copy Failed");
    }
});

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    historyList.innerHTML = "<li>No History Yet</li>";
});