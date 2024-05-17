// Transaction class
class Transaction {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
  }

  // Method to check if the transaction is valid
  isValid() {
    return this.description && this.amount && this.amount > 0;
  }
}

// Income class inheriting from Transaction
class Income extends Transaction {
  constructor(description, amount) {
    super(description, amount);
  }
}

// Expense class inheriting from Transaction
class Expense extends Transaction {
  constructor(description, amount) {
    super(description, amount);
  }
}

// Budget class
class Budget {
  constructor() {
    // Initialize incomes and expenses from local storage or as empty arrays
    this.incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    // Initialize previous state for undo functionality
    this.previousState = { incomes: [], expenses: [] };
    // Initialize the budget
    this.init();
  }

  // Initialize method
  init() {
    // Setup forms, update summary, and display transactions
    this.setupForms();
    this.updateSummary();
    this.displayTransactions();
  }

  // Setup forms dynamically
  setupForms() {
    const incomeSection = document.getElementById('incomeSection');
    const expenseSection = document.getElementById('expenseSection');
    const summarySection = document.getElementById('summary');

    // Income form
    const incomeForm = document.createElement('form');
    incomeForm.id = 'incomeForm';
    incomeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addIncome();
    });

    // Create input elements for income description and amount
    const incomeDescriptionLabel = document.createElement('label');
    incomeDescriptionLabel.setAttribute('for', 'incomeDescription');
    incomeDescriptionLabel.textContent = 'Description:';
    const incomeDescriptionInput = document.createElement('input');
    incomeDescriptionInput.type = 'text';
    incomeDescriptionInput.id = 'incomeDescription';
    incomeDescriptionInput.placeholder = 'Description';
    incomeDescriptionInput.required = true;

    const incomeAmountLabel = document.createElement('label');
    incomeAmountLabel.setAttribute('for', 'incomeAmount');
    incomeAmountLabel.textContent = 'Amount:';
    const incomeAmountInput = document.createElement('input');
    incomeAmountInput.type = 'number';
    incomeAmountInput.id = 'incomeAmount';
    incomeAmountInput.placeholder = 'Amount';
    incomeAmountInput.required = true;

    // Create submit button for adding income
    const incomeSubmitButton = document.createElement('button');
    incomeSubmitButton.type = 'submit';
    incomeSubmitButton.textContent = 'Add Income';

    // Append input elements and submit button to the form
    incomeForm.append(
      incomeDescriptionLabel,
      incomeDescriptionInput,
      incomeAmountLabel,
      incomeAmountInput,
      incomeSubmitButton
    );

    // Append income form to the income section
    incomeSection.appendChild(incomeForm);

    // Expense form
    const expenseForm = document.createElement('form');
    expenseForm.id = 'expenseForm';
    expenseForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addExpense();
    });

    // Create input elements for expense description and amount
    const expenseDescriptionLabel = document.createElement('label');
    expenseDescriptionLabel.setAttribute('for', 'expenseDescription');
    expenseDescriptionLabel.textContent = 'Description:';
    const expenseDescriptionInput = document.createElement('input');
    expenseDescriptionInput.type = 'text';
    expenseDescriptionInput.id = 'expenseDescription';
    expenseDescriptionInput.placeholder = 'Description';
    expenseDescriptionInput.required = true;

    const expenseAmountLabel = document.createElement('label');
    expenseAmountLabel.setAttribute('for', 'expenseAmount');
    expenseAmountLabel.textContent = 'Amount:';
    const expenseAmountInput = document.createElement('input');
    expenseAmountInput.type = 'number';
    expenseAmountInput.id = 'expenseAmount';
    expenseAmountInput.placeholder = 'Amount';
    expenseAmountInput.required = true;

    // Create submit button for adding expense
    const expenseSubmitButton = document.createElement('button');
    expenseSubmitButton.type = 'submit';
    expenseSubmitButton.textContent = 'Add Expense';

    // Append input elements and submit button to the form
    expenseForm.append(
      expenseDescriptionLabel,
      expenseDescriptionInput,
      expenseAmountLabel,
      expenseAmountInput,
      expenseSubmitButton
    );

    // Append expense form to the expense section
    expenseSection.appendChild(expenseForm);

    // Summary section
    const totalIncome = document.createElement('p');
    totalIncome.textContent = 'Total Income: ';
    const totalIncomeAmount = document.createElement('span');
    totalIncomeAmount.id = 'totalIncome';
    totalIncome.append(totalIncomeAmount);

    const totalExpenses = document.createElement('p');
    totalExpenses.textContent = 'Total Expenses: ';
    const totalExpensesAmount = document.createElement('span');
    totalExpensesAmount.id = 'totalExpenses';
    totalExpenses.append(totalExpensesAmount);

    const totalBudget = document.createElement('p');
    totalBudget.textContent = 'Total Budget: ';
    const totalBudgetAmount = document.createElement('span');
    totalBudgetAmount.id = 'totalBudget';
    totalBudget.append(totalBudgetAmount);

    // Create buttons for undo and reset
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

    // Append elements to the summary section
    summarySection.append(totalIncome, totalExpenses, totalBudget, undoButton, resetButton);
  }

  // Method to add income
  addIncome() {
    const description = document.getElementById('incomeDescription').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const income = new Income(description, amount);
    if (income.isValid()) {
      this.incomes.push(income);
      this.saveData();
      this.updateSummary();
      this.displayTransactions();
    } else {
      alert('Please enter valid income description and amount.');
    }
  }

  // Method to add expense
  addExpense() {
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const expense = new Expense(description, amount);
    if (expense.isValid()) {
      this.expenses.push(expense);
      this.saveData();
      this.updateSummary();
      this.displayTransactions();
    } else {
      alert('Please enter valid expense description and amount.');
    }
  }

  // Method to undo the last transaction
  undo() {
    this.incomes.pop();
    this.expenses.pop();
    this.saveData();
    this.updateSummary();
    this.displayTransactions();
  }

  // Method to calculate total incomes
  calculateTotalIncomes() {
    return this.incomes.reduce((total, income) => total + income.amount, 0);
  }

  // Method to calculate total expenses
  calculateTotalExpenses() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  // Method to calculate total budget
  calculateTotalBudget() {
    return this.calculateTotalIncomes() - this.calculateTotalExpenses();
  }

  // Method to save data to local storage
  saveData() {
    localStorage.setItem('incomes', JSON.stringify(this.incomes));
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  // Method to update summary
  updateSummary() {
    document.getElementById('totalIncome').textContent = this.calculateTotalIncomes();
    document.getElementById('totalExpenses').textContent = this.calculateTotalExpenses();
    document.getElementById('totalBudget').textContent = this.calculateTotalBudget();
  }

  // Method to display transactions
  displayTransactions() {
    const incomeList = document.getElementById('incomeList');
    const expenseList = document.getElementById('expenseList');

    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    this.incomes.forEach(income => {
      const listItem = document.createElement('li');
      listItem.textContent = `${income.description}: $${income.amount}`;
      incomeList.appendChild(listItem);
    });

    this.expenses.forEach(expense => {
      const listItem = document.createElement('li');
      listItem.textContent = `${expense.description}: $${expense.amount}`;
      expenseList.appendChild(listItem);
    });
  }

  // Method to reset the budget
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
