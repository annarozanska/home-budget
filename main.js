const todoInputNameIncome = document.querySelector('.todo-input-name-income');
const todoInputNumberIncome = document.querySelector('.todo-input-number-income');
const todoBtnAddIncome = document.querySelector('.btn-add-income');
const todoListIncome = document.querySelector('.todo-box-list-income ul');

const todoInputNameExpense = document.querySelector('.todo-input-name-expense');
const todoInputNumberExpense = document.querySelector(
	'.todo-input-number-expense'
);
const todoBtnAddExpense = document.querySelector('.btn-add-expense');
const todoListExpense = document.querySelector('.todo-box-list-expense ul');

const ulList = document.querySelectorAll('.list');

const balanceTotal = document.querySelector('.balance-total');
const incomeTotal = document.querySelector('.income-total');
const expenseTotal = document.querySelector('.expense-total');

const popup = document.querySelector('.popup');
const popupInputText = document.querySelector('.popup-input-text');
const popupInputNumber = document.querySelector('.popup-input-number');
const popupBtnAdd = document.querySelector('.accept');
const popupBtnRemove = document.querySelector('.cancel');

const DOMEvents = () => {
	todoBtnAddIncome.addEventListener('click', createNewTodoIncome);
	todoBtnAddExpense.addEventListener('click', createNewTodoExpense);

	ulList.forEach((item) => {
		item.addEventListener('click', deleteOrEditLi);
	});

	popupBtnRemove.addEventListener('click', deleteOrEditPopup);
	popupBtnAdd.addEventListener('click', deleteOrEditPopup);
};

const main = () => {
	DOMEvents();
};

let BUDGET = [];

const createNewTodoIncome = () => {
	let valueNum = todoInputNumberIncome.value;
	let valueText = todoInputNameIncome.value;

	if (valueText == '' || valueNum <= 0 || valueNum == '') {
		clearInput([todoInputNameIncome, todoInputNumberIncome]);
		alert('Wprowadz tekst oraz dodatnią wrtość');
	} else {
		let income = {
			type: 'income',
			title: valueText,
			amount: parseInt(valueNum),
			id: BUDGET.length,
		};

		BUDGET.push(income);

		BUDGET.forEach((en, index) => {
			if (index == BUDGET.length - 1) {
				if (en.type == 'income') {
					showLi(todoListIncome, en.type, en.title, en.amount, en.id);
				}
			}
		});

		updateSum();
		clearInput([todoInputNameIncome, todoInputNumberIncome]);
	}
};

const createNewTodoExpense = () => {
	let valueNum = todoInputNumberExpense.value;
	let valueText = todoInputNameExpense.value;

	if (valueText == '' || valueNum <= 0 || valueNum == '') {
		clearInput([todoInputNameExpense, todoInputNumberExpense]);
		alert('Wprowadz tekst oraz dodatnią wrtość');
	} else {
		let expense = {
			type: 'expense',
			title: valueText,
			amount: parseInt(valueNum),
			id: BUDGET.length,
		};
		BUDGET.push(expense);

		BUDGET.forEach((en, index) => {
			if (index == BUDGET.length - 1) {
				if (en.type == 'expense') {
					showLi(todoListExpense, en.type, en.title, en.amount, en.id);
				}
			}
		});

		updateSum();
		clearInput([todoInputNameExpense, todoInputNumberExpense]);
	}
};

const clearInput = (input) => {
	input.forEach((input) => {
		input.value = '';
	});
};

const calculate = (type, list) => {
	let sum = 0;

	list.forEach((enter) => {
		if (enter.type == type) {
			sum += enter.amount;
		}
	});
	return sum;
};

let income = 0;
let expense = 0;
let youHave = 0;

const showBalance = (income, expense) => {
	if (income > expense) {
		return income - expense;
	} else if (income - expense === 0) {
		return 0;
	} else {
		return -income + expense;
	}
};

const updateSum = () => {
	income = calculate('income', BUDGET);
	expense = calculate('expense', BUDGET);
	youHave = Math.abs(showBalance(income, expense));

	if (income > expense) {
		balanceTotal.innerHTML = `Możesz jeszcze wydać ${youHave} zł`;
	} else if (income - expense === 0) {
		balanceTotal.innerHTML = `Bilans wynosi ${youHave} zł`;
	} else {
		balanceTotal.innerHTML = `Bilans jest ujemny. Jesteś na minusie ${youHave} zł`;
	}
	incomeTotal.innerHTML = `Suma przychodów: ${income} zł`;
	expenseTotal.innerHTML = `Suma Wydatków: ${expense} zł`;
};

const showLi = (todoList, type, title, amount, id) => {
	const showTodo = `
            <li id="${id}" class="${type}">
            <p>${title[0].toUpperCase() + title.substring(1)}: ${amount} zł</p>
                <div class="tools">
                    <button id="edit" data-id="${id}" class="edit">EDIT</button>
                    <button id="delete" class="delete"><i class="fas fa-times"></i></button>
                </div>
            </li>
        `;

	todoList.innerHTML += showTodo;
};

const deleteOrEditLi = (e) => {
	if (e.target.matches('.fas')) {
		let pathLi = e.path[3];
		pathLi.parentNode.removeChild(pathLi);
		delete BUDGET[pathLi.id];

		updateSum();
	} else if (e.target.matches('.edit')) {
		popup.style.display = 'flex';
		popup.setAttribute('data-elId', e.target.getAttribute('data-id'));
	}
};

const deleteOrEditPopup = (e) => {
	if (e.target.matches('.cancel')) {
		popup.style.display = 'none';
	} else if (e.target.matches('.accept')) {
		BUDGET.forEach((en, index) => {
			if (index === +popup.getAttribute('data-elId')) {
				if (en.type == 'expense') {
					en.title = popupInputText.value;
					en.amount = parseInt(popupInputNumber.value);

					const li = todoListExpense.querySelectorAll('li');
					li.forEach((item) => {
						if (item.id == en.id) {
							item.firstElementChild.textContent = `${
								en.title[0].toUpperCase() + en.title.substring(1)
							}: ${en.amount} zł`;
						}
					});

					popupInputText.value = '';
					popupInputNumber.value = '';
				} else if (en.type == 'income') {
					en.title = popupInputText.value;
					en.amount = parseInt(popupInputNumber.value);

					const li = todoListIncome.querySelectorAll('li');
					li.forEach((item) => {
						if (item.id == en.id) {
							item.firstElementChild.textContent = `${
								en.title[0].toUpperCase() + en.title.substring(1)
							}: ${en.amount} zł`;
						}
					});

					popupInputText.value = '';
					popupInputNumber.value = '';
				}
			}
		});

		updateSum();
		popup.style.display = 'none';
	}
};

document.addEventListener('DOMContentLoaded', main);
