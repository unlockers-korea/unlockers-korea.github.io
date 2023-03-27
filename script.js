let result = document.getElementById("result");
let clear = document.getElementById("clear");
let backspace = document.getElementById("backspace");
let divide = document.getElementById("divide");
let multiply = document.getElementById("multiply");
let subtract = document.getElementById("subtract");
let add = document.getElementById("add");
let equals = document.getElementById("equals");
let decimal = document.getElementById("decimal");

let operand1 = "";
let operand2 = "";
let operator = "";
let decimalClicked = false;

// 숫자 버튼 클릭 시
function numberClicked(number) {
if (operator === "") {
operand1 += number;
result.value = operand1;
} else {
operand2 += number;
result.value = operand2;
}
}

// 연산 버튼 클릭 시
function operatorClicked(op) {
operator = op;
decimalClicked = false;
}

// 소수점 버튼 클릭 시
function decimalClickedFunc() {
if (!decimalClicked) {
decimalClicked = true;
if (operator === "") {
operand1 += ".";
result.value = operand1;
} else {
operand2 += ".";
result.value = operand2;
}
}
}

// 계산 결과 반환 함수
function calculate() {
let num1 = parseFloat(operand1);
let num2 = parseFloat(operand2);
let res;
if (operator === "+") {
res = num1 + num2;
} else if (operator === "-") {
res = num1 - num2;
} else if (operator === "×") {
res = num1 * num2;
} else if (operator === "÷") {
res = num1 / num2;
}
result.value = res.toFixed(2);
}

// C 버튼 클릭 시
clear.addEventListener("click", function() {
operand1 = "";
operand2 = "";
operator = "";
decimalClicked = false;
result.value = "0";
});

// ← 버튼 클릭 시
backspace.addEventListener("click", function() {
if (operator === "") {
operand1 = operand1.slice(0, -1);
result.value = operand1;
} else {
operand2 = operand2.slice(0, -1);
result.value = operand2;
}
});

// 숫자 버튼 클릭 시 이벤트 리스너 등록
for (let i = 0; i <= 9; i++) {
let button = document.getElementById(i);
button.addEventListener("click", function() {
numberClicked(i.toString());
});
}

// 연산 버튼 클릭 시 이벤트 리스너 등록
add.addEventListener("click", function() {
operatorClicked("+");
});
subtract.addEventListener("click", function() {
operatorClicked("-");
});
multiply.addEventListener("click", function() {
operatorClicked("×");
});
divide.addEventListener("click", function() {
operatorClicked("÷");
});

// 소수점 버튼 클릭 시 이벤트 리스너 등록
decimal.addEventListener("click", decimalClickedFunc);

// = 버튼 클릭 시 이벤트 리스너 등록
equals.addEventListener("click", calculate);

