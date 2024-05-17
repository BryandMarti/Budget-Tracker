// Transaction class
class Transaction {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
  }

  //this method makes sure to check if the Transaction is Valid, it would return true or False
  isValid() {
    return this.description && this.amount && this.amount > 0;
  }
}

//this Income as well as Expense class will be inheriting from Transaction class
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

// Budget class using Local storage to alocate data, Please refer to ReadMe for more details
class Budget {
  constructor() {
    // this (this) will Initialize the income snd expenses from a local storage or as empty arrays
    this.incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    //"undo" button implementation, initializing previous tracing for undo functionality later on the code
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

  //this will help set the forms to be dynamic.
  setupForms() {
    const incomeSection = document.getElementById('incomeSection');
    const expenseSection = document.getElementById('expenseSection');
    const summarySection = document.getElementById('summary');

    //Creating the Element form adding a feature (preventDefaault) to cancel unnecessary keystrokes
    const incomeForm = document.createElement('form');
    incomeForm.id = 'incomeForm';
    incomeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addIncome();
    });

    //this series of codes will help me create a more JavaScript oriented code and leave behind hard coding on HTML
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

    //this creates a submit button to add incometo the localStorage/empty array
    const incomeSubmitButton = document.createElement('button');
    incomeSubmitButton.type = 'submit';
    incomeSubmitButton.textContent = 'Add Income';

    //I need to append input elements and buttons 
    incomeForm.append(
      incomeDescriptionLabel,
      incomeDescriptionInput,
      incomeAmountLabel,
      incomeAmountInput,
      incomeSubmitButton
    );

    // Append income form to the income section
    incomeSection.appendChild(incomeForm);

    //Expenses Form same for lines (54 thru 96)
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

    //this section is coded in regard to the summary (the total of the Income, Expense, and Budget)
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

    //implementing a more intuitive look with an Undo and Reset Button
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

  //this is where the Method to calculate the Incomes
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

    //this is where the Method to calculate the Expenses
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

    //Method to undo (talked more about learning aproach in ReadMe file)
    undo() {
    this.incomes.pop();
    this.expenses.pop();
    this.saveData();
    this.updateSummary();
    this.displayTransactions();
  }

    //total Income, Expenses, and Budget calculation Methods
    calculateTotalIncomes() {
    return this.incomes.reduce((total, income) => total + income.amount, 0);
  }

  calculateTotalExpenses() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  calculateTotalBudget() {
    return this.calculateTotalIncomes() - this.calculateTotalExpenses();
  }

    //Decided to alocate data to local storage
    saveData() {
    localStorage.setItem('incomes', JSON.stringify(this.incomes));
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

    //this method updates the summary portion of the Budget calculator
    updateSummary() {
    document.getElementById('totalIncome').textContent = this.calculateTotalIncomes();
    document.getElementById('totalExpenses').textContent = this.calculateTotalExpenses();
    document.getElementById('totalBudget').textContent = this.calculateTotalBudget();
  }

    //With this Method I displayed the data in to the application.
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

    //Method to undo (talked more about learning aproach in ReadMe file)
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
