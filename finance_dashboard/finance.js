let transactions = JSON.parse(localStorage.getItem("transactions")) || [
{ date: "2024-06-01", category: "Salary", amount: 50000, type: "income" },
{ date: "2024-06-03", category: "Groceries", amount: 5000, type: "expense" },
{ date: "2024-06-05", category: "Rent", amount: 15000, type: "expense" },
];

let role = "viewer";

// Render everything
function render() {
let income = 0, expense = 0;

const table = document.getElementById("transactionTable");
table.innerHTML = "";

transactions.forEach(t => {
if (t.type === "income") income += t.amount;
else expense += t.amount;


table.innerHTML += `
  <tr>
    <td> ${t.date}</td>
    <td> ${t.category}</td>
    <td style="color:${t.type === 'income' ? 'green' : 'red'}">
      ₹ ${t.amount}
    </td>
    <td> ${t.type}</td>
  </tr>
`;


});

document.getElementById("income").innerText = "₹" + income;
document.getElementById("expenses").innerText = "₹" + expense;
document.getElementById("balance").innerText = "₹" + (income - expense);

generateCharts();
generateInsights();
}


function clearAllData() {
  if (role !== "admin") {
alert("Only admin can clear data");
return;
}
if (confirm("Are you sure you want to delete all transactions?")) {

localStorage.removeItem("transactions");

// Reset array
transactions = [];

// Re-render UI
render();
}
}
// Add Transaction
function addTransaction() {
if (role !== "admin") return;

const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const category = categoryInput.value.trim();
const amount = Number(amountInput.value);
const type = typeInput.value;

transactions.push({
date: new Date().toISOString().split("T")[0],
category,
amount,
type
});

localStorage.setItem("transactions", JSON.stringify(transactions));

render();


categoryInput.value = "";
amountInput.value = "";
typeInput.value = "income";

categoryInput.focus();
}



// Role switch
document.getElementById("roleSelect").addEventListener("change", (e) => {
role = e.target.value;
document.getElementById("adminPanel").classList.toggle("d-none", role !== "admin");
});

// Search
document.getElementById("search").addEventListener("input", (e) => {
const value = e.target.value.toLowerCase();

const filtered = transactions.filter(t =>
t.category.toLowerCase().includes(value)
);

document.getElementById("transactionTable").innerHTML = filtered.map(t => `     <tr>       <td>${t.date}</td>       <td>${t.category}</td>       <td>₹${t.amount}</td>       <td>${t.type}</td>     </tr>
  `).join("");
});

// Charts
let trendChart, categoryChart;

function generateCharts() {

  if (trendChart) trendChart.destroy();
  if (categoryChart) categoryChart.destroy();

const ctx1 = document.getElementById("trendChart");
const ctx2 = document.getElementById("categoryChart");

trendChart= new Chart(ctx1, {
type: 'bar',
data: {
labels: transactions.map(t => t.date),
datasets: [{
    label: "Balance Trend",
    data: transactions.map(t => t.type === "income" ? t.amount : -t.amount),
    borderColor: "darkblue",
    color: "black",
    borderWidth: 1
}]
}
});

const categories = {};
transactions.forEach(t => {
if (t.type === "expense") {
categories[t.category] = (categories[t.category] || 0) + t.amount;
}
});

categoryChart= new Chart(ctx2, {
type: 'doughnut',
data: {
labels: Object.keys(categories),
datasets: [{
    data: Object.values(categories)
}]
}
});
}

// Insights
function generateInsights() {
let categoryTotals = {};

transactions.forEach(t => {
if (t.type === "expense") {
categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
}
});

if (Object.keys(categoryTotals).length === 0) {
document.getElementById("insights").innerText =
"No expense data available.";
return;
}

let highest = Object.keys(categoryTotals).reduce((a, b) =>
categoryTotals[a] > categoryTotals[b] ? a : b
);



document.getElementById("insights").innerText =
"Highest spending category: " + highest;
}

render();
