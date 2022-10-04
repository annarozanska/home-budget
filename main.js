let todoInputNameIncome = document.querySelector('.todo-input-name-income');
let todoInputNumberIncome = document.querySelector('.todo-input-number-income');
let todoBtnAddIncome = document.querySelector('.btn-add-income');
let todoListIncome = document.querySelector('.todo-box-list-income ul');

let todoInputNameExpense = document.querySelector('.todo-input-name-expense');
let todoInputNumberExpense = document.querySelector(
	'.todo-input-number-expense'
);
let todoBtnAddExpense = document.querySelector('.btn-add-expense');
let todoListExpense = document.querySelector('.todo-box-list-expense ul');

let ulList = document.querySelectorAll('.list');

let balanceTotal = document.querySelector('.balance-total');
let incomeTotal = document.querySelector('.income-total');
let expenseTotal = document.querySelector('.expense-total');

let popup = document.querySelector('.popup');
let popupInputText = document.querySelector('.popup-input-text');
let popupInputNumber = document.querySelector('.popup-input-number');
let popupBtnAdd = document.querySelector('.accept');
let popupBtnRemove = document.querySelector('.cancel');

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
				if(en.type == 'income'){
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
		incomeTotal.innerHTML = `Suma przychodów: ${income} zł`;
		expenseTotal.innerHTML = `Suma Wydatków: ${expense} zł`;
	} else if (income - expense === 0) {
		balanceTotal.innerHTML = `Bilans wynosi ${youHave} zł`;
		incomeTotal.innerHTML = `Suma przychodów: ${income} zł`;
		expenseTotal.innerHTML = `Suma Wydatków: ${expense} zł`;
	} else {
		balanceTotal.innerHTML = `Bilans jest ujemny. Jesteś na minusie ${youHave} zł`;
		incomeTotal.innerHTML = `Suma przychodów: ${income} zł`;
		expenseTotal.innerHTML = `Suma Wydatków: ${expense} zł`;
	}
};

const showLi = (todoList, type, title, amount, id) => {
	const showTodo = `
            <li id="${id}" class="${type}">
            <p>${title[0].toUpperCase() + title.substring(1)}: ${amount} zł</p>
                <div class="tools">
                    <button id="edit" class="edit">EDIT</button>
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
		// console.log(e.path[3]);
		
		popup.style.display = 'flex';
	}
};

const deleteOrEditPopup = (e) => {  
	if (e.target.matches('.cancel')) {
		popup.style.display = 'none';
	} else if (e.target.matches('.accept')) {

		BUDGET.forEach((en, index) => {
			
			if (index == BUDGET.length - 1) {
				if (en.type == 'expense') {
					en.title = popupInputText.value
					en.amount = parseInt(popupInputNumber.value)
					// console.log(BUDGET);

					const li = todoListExpense.querySelectorAll('li')
					li.forEach((item) => {
						if(item.id == en.id){
							const li = item[item.id]
							console.log(li);
							// console.log(item.id)
							// console.log(en.id)
							
							item.innerHTML = `<p>${en.title[0].toUpperCase() + en.title.substring(1)}: ${en.amount} zł</p>
							<div class="tools">
								<button id="edit" class="edit">EDIT</button>
								<button id="delete" class="delete"><i class="fas fa-times"></i></button>
							</div>`
						}
					});

					popupInputText.value =''
					popupInputNumber.value = ''
					// console.log(todoListExpense)
					
				}else if(en.type == 'income'){
					en.title = popupInputText.value
					en.amount = parseInt(popupInputNumber.value)
					console.log(BUDGET);
					
					const li = todoListIncome.querySelectorAll('li')
					li.forEach((item) => {
						if(item.id == en.id){
							console.log(item.firstElementChild);
							
							item.firstElementChild.textContent = `${en.title[0].toUpperCase() + en.title.substring(1)}: ${en.amount} zł`
						}
					});
					
					popupInputText.value =''
					popupInputNumber.value = ''

					// console.log(todoListIncome)
				}
			} 
		});
		
		updateSum();
		popup.style.display = 'none';
	}
};

document.addEventListener('DOMContentLoaded', main);
