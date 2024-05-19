// Transaction class
class Transaction {
  constructor(description, amount, date) {
    this.description = description;
    this.amount = amount;
    this.date = date || null;
  }

  // Check if the transaction is valid
  isValid() {
    return this.description && this.amount && this.amount > 0;
  }
}

// Income class inheriting from Transaction
class Income extends Transaction {
  constructor(description, amount, date) {
    super(description, amount, date);
  }
}

// Expense class inheriting from Transaction
class Expense extends Transaction {
  constructor(description, amount, date) {
    super(description, amount, date);
  }
}

// Budget class and constructor creation with localstorage as our memory.
class Budget {
  constructor() {
    this.incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    this.previousState = { incomes: [], expenses: [] };
    this.init();
  }

  init() {
    this.setupForms();
    this.updateSummary();
    this.displayTransactions();
  }
// using variables to store data coming from the DOM elements
  setupForms() {
    const incomeSection = document.getElementById('incomeSection');
    const expenseSection = document.getElementById('expenseSection');
    const summarySection = document.getElementById('summary');

    //appending the elements
    const incomeForm = this.createForm('incomeForm', 'incomeDescription', 'incomeAmount', 'incomeDate', 'Add Income', this.addIncome.bind(this));
    incomeSection.appendChild(incomeForm);

    const expenseForm = this.createForm('expenseForm', 'expenseDescription', 'expenseAmount', 'expenseDate', 'Add Expense', this.addExpense.bind(this));
    expenseSection.appendChild(expenseForm);

    this.createSummary(summarySection);
}

//event listener function for the forms
createForm(formId, descriptionId, amountId, dateId, buttonText, submitHandler) {
  const form = document.createElement('form');
  form.id = formId;
  form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitHandler();
  });


  //creating elements to later insert them into HTML using InnerHtml
  const descriptionLabel = document.createElement('label');
  descriptionLabel.setAttribute('for', descriptionId);
  descriptionLabel.textContent = 'Budget Name:';
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.id = descriptionId;
  descriptionInput.required = true;

  const amountLabel = document.createElement('label');
  amountLabel.setAttribute('for', amountId);
  amountLabel.textContent = 'Amount:';
  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.id = amountId;
  amountInput.required = true;
  amountInput.maxLength = 10;
  

  amountInput.removeAttribute('number');
  amountInput.setAttribute('maxlength', '9');

  const dateLabel = document.createElement('label');
  dateLabel.setAttribute('for', dateId);
  dateLabel.textContent = 'Date (optional):';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = dateId;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = buttonText;

  form.append(descriptionLabel, descriptionInput, amountLabel, amountInput, dateLabel, dateInput, submitButton);
  return form;
}


//this displays the sumary into the website, putting together all income, expense and budget
  createSummary(summarySection) {
    const totalIncome = this.createSummaryElement('Total Income:', 'totalIncome');
    const totalExpenses = this.createSummaryElement('Total Expenses:', 'totalExpenses');
    const totalBudget = this.createSummaryElement('Total Budget:', 'totalBudget');

    //created an undo and reset button
    const undoButton = document.createElement('button');
    undoButton.id = 'undoButton';
    undoButton.textContent = 'Undo';
    undoButton.addEventListener('click', () => {
      this.undo();
    });

    const resetButton = document.createElement('button');
    resetButton.id = 'resetButton';
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => {
      this.reset();
    });

    summarySection.append(totalIncome, totalExpenses, totalBudget, undoButton, resetButton);
  }

  createSummaryElement(labelText, spanId) {
    const element = document.createElement('p');
    element.textContent = labelText;
    const span = document.createElement('span');
    span.id = spanId;
    element.append(span);
    return element;
  }
//over to this code, we are adding the income, and expenses, to later on use this variable and store it on LocalStorage
  addIncome() {
    const description = document.getElementById('incomeDescription').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value || null;
    const income = new Income(description, amount, date);
    if (income.isValid()) {
      this.incomes.push(income);
      this.saveData();
      this.updateSummary();
      this.displayTransactions();
    } else {
      alert('Please enter valid income description and amount.');
    }
  }

  addExpense() {
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value || null;
    const expense = new Expense(description, amount, date);
    if (expense.isValid()) {
      this.expenses.push(expense);
      this.saveData();
      this.updateSummary();
      this.displayTransactions();
    } else {
      alert('Please enter valid expense description and amount.');
    }
  }
//this undos the last addition, or last calculation between income and expense... needs some work.
  undo() {
    if (this.incomes.length > 0) this.incomes.pop();
    if (this.expenses.length > 0) this.expenses.pop();
    this.saveData();
    this.updateSummary();
    this.displayTransactions();
  }

  calculateTotalIncomes() {
    return this.incomes.reduce((total, income) => total + income.amount, 0);
  }

  calculateTotalExpenses() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  calculateTotalBudget() {
    return this.calculateTotalIncomes() - this.calculateTotalExpenses();
  }


  //here we are using the function Localstorage and stringying it to its Unique JSOn file
  saveData() {
    localStorage.setItem('incomes', JSON.stringify(this.incomes));
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  updateSummary() {
    document.getElementById('totalIncome').textContent = this.calculateTotalIncomes();
    document.getElementById('totalExpenses').textContent = this.calculateTotalExpenses();
    document.getElementById('totalBudget').textContent = this.calculateTotalBudget();
  }

  // here we are going to display our last part of the code where we are using function expression => to show our UL/LI with names and amount of budge
  displayTransactions() {
    const incomeList = document.getElementById('incomeList');
    const expenseList = document.getElementById('expenseList');

    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    this.incomes.forEach(income => {
      const listItem = document.createElement('li');
      listItem.textContent = `${income.description}: $${income.amount}${income.date ? ` (Date: ${income.date})` : ''}`;
      incomeList.appendChild(listItem);
    });

    this.expenses.forEach(expense => {
      const listItem = document.createElement('li');
      listItem.textContent = `${expense.description}: $${expense.amount}${expense.date ? ` (Date: ${expense.date})` : ''}`;
      expenseList.appendChild(listItem);
    });
  }
//reset button as talked above
  reset() {
    this.incomes = [];
    this.expenses = [];
    localStorage.removeItem('incomes');
    localStorage.removeItem('expenses');
    this.updateSummary();
    this.displayTransactions();
  }
}

// Create a new instance of Budget
const budget = new Budget();
