// Initial transactions array
let transactions = [];

// Utility function to generate a unique ID for each transaction
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value;
  const amount = document.querySelector('input[name="amount"]').value;
  const date = document.querySelector('input[name="date"]').value;
  const description = document.querySelector('textarea[name="description"]').value;
  const type = document.querySelector('input[name="type"]').checked ? 'income' : 'expense';

  if (name.trim() === '' || amount.trim() === '' || date.trim() === '' || description.trim() === '') {
    alert('Please fill in all fields');
    return;
  }

  const transaction = {
    id: generateID(),
    name,
    amount: +amount,
    date,
    description,
    type
  };

  transactions.push(transaction);
  addTransactionToDOM(transaction);
  updateBalance();

  document.querySelector('input[name="name"]').value = '';
  document.querySelector('input[name="amount"]').value = '';
  document.querySelector('input[name="date"]').value = '';
  document.querySelector('textarea[name="description"]').value = '';
}

// Function to add transaction to DOM
function addTransactionToDOM(transaction) {
  const list = document.getElementById('transactionList');
  const item = document.createElement('li');

  item.innerHTML = `
    <div class="name">
      <h4>${transaction.name}</h4>
      <p>${transaction.description}</p>
    </div>
    <div class="date">${transaction.date}</div>
    <div class="amount ${transaction.type}">
      ${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount)}
    </div>
    <div class="action">
      <svg onclick="removeTransaction(${transaction.id})" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,13H5V11H19V13Z" />
      </svg>
      <svg onclick="showEditSection(${transaction.id})" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M11,14H13V16H11V14M11,7H13V12H11V7Z" />
      </svg>
    </div>
  `;

  list.appendChild(item);
}

// Function to update balance, income, and expenses
function updateBalance() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const total = income - expense;

  document.getElementById('balance').innerText = `$${total.toFixed(2)}`;
  document.getElementById('income').innerText = `$${income.toFixed(2)}`;
  document.getElementById('expense').innerText = `$${expense.toFixed(2)}`;
}

// Function to remove a transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  init();
}

// Function to initialize app
function init() {
  document.getElementById('transactionList').innerHTML = '';
  transactions.forEach(addTransactionToDOM);
  updateBalance();
}

// Event listener for form submission
document.getElementById('transactionForm').addEventListener('submit', addTransaction);

// Initialize app
init();

// Function to show edit section
function showEditSection(id) {
  const transaction = transactions.find(t => t.id === id);

  if (!transaction) return;

  document.getElementById('editSection').style.display = 'block';
  document.querySelector('input[name="editName"]').value = transaction.name;
  document.querySelector('input[name="editAmount"]').value = transaction.amount;
  document.querySelector('input[name="editDate"]').value = transaction.date;
  document.querySelector('textarea[name="editDescription"]').value = transaction.description;
  document.querySelector('input[name="editType"]').checked = transaction.type === 'income';

  document.getElementById('editTransactionForm').onsubmit = function(e) {
    e.preventDefault();
    saveTransaction(id);
  };
}

// Function to hide edit section
function hideEditSection() {
  document.getElementById('editSection').style.display = 'none';
}

// Function to save edited transaction
function saveTransaction(id) {
  const name = document.querySelector('input[name="editName"]').value;
  const amount = document.querySelector('input[name="editAmount"]').value;
  const date = document.querySelector('input[name="editDate"]').value;
  const description = document.querySelector('textarea[name="editDescription"]').value;
  const type = document.querySelector('input[name="editType"]').checked ? 'income' : 'expense';

  transactions = transactions.map(transaction =>
    transaction.id === id
      ? { ...transaction, name, amount: +amount, date, description, type }
      : transaction
  );

  hideEditSection();
  init();
}
