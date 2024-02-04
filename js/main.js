const inputArea = document.querySelector('#input');
const inputAreaDup = document.querySelector('#input2');
const inputAreaDupDup = document.querySelector('#input3');
const inputForSum = document.querySelector('#input4');
const inputAreaOverdue = document.querySelector('#input5');
const outputArea = document.querySelector('#output');
const outputAreaDup = document.querySelector('#output2');
const outputForSum = document.querySelector('#output3');
const outputAreaOverdue = document.querySelector('#output4');
const submitButton = document.querySelector('#submit');
const submitButton2 = document.querySelector('#submit2');
const submitButton3 = document.querySelector('#submit3');
const submitButton4 = document.querySelector('#submit4');
const outputLabel = document.querySelector('#outputlabel');
const sumOutput = document.querySelector('#sumoutput');
let currency = document.querySelector('.currency');
const nav = document.querySelectorAll('a');
const activePage = window.location.pathname;
const regex = /\d{10}/;
let dup = 0;

function convertInputToInvoices(input, output) {
	const regex = /\d{10}/;
	const final = [];
	let text = input.value.split(' ');

	text = text.join();
	text = text.split('\n');
	text = text.join();
	text = text.split('\t');
	text = text.join();
	text = text.split(',');

	text.forEach(element => {
		if (regex.test(element)) {
			final.push(element);
		}
	});

	for (let i = 0; i < final.length; i++) {
		final[i] = final[i].replace(/\D/g, '');
	}
	for (let i = 0; i < final.length; i++) {
		if (final[i] < 3600000000) {
			final.splice(i, 1);
		} else if (final[i] > 5100000000) {
			final.splice(i, 1);
		}
	}

	const unique = [...new Set(final)];
	// outputArea.value = ' ';

	for (let i = 1; i < unique.length; i++) {
		unique[i] = ' ' + unique[i];
	}
	output.value = unique;
	dup = final.length;

	return unique;
}

function submitButtonHandler() {
	convertInputToInvoices(inputArea, outputArea);
	let unique = convertInputToInvoices(inputArea, outputArea);
	outputArea.value = convertInputToInvoices(inputArea, outputArea);
	let duplicates = dup - unique.length;
	outputLabel.textContent = 'Output: ' + unique.length + ' invoices (' + duplicates + ' duplicates removed)';
	inputAreaDup.textContent = outputArea.value;
}
function findMissing() {
	let more;
	let less;
	let missing = [];

	if (inputAreaDup.value.length > inputAreaDupDup.value.length) {
		more = inputAreaDup.value;
		less = inputAreaDupDup.value;
	} else {
		more = inputAreaDupDup.value;
		less = inputAreaDup.value;
	}

	more = more.split(' ');
	more = more.join();
	more = more.split(',');
	less = less.split(' ');
	less = less.join();
	less = less.split(',');
	more.forEach(element => {
		if (!less.includes(element)) {
			missing.push(element);
		}
	});
	for (let i = 1; i < missing.length; i++) {
		missing[i] = ' ' + missing[i];
	}

	outputAreaDup.value = missing;
}

function copyToClipboard() {
	outputArea.classList.add('copyanimation');
	navigator.clipboard.writeText(outputArea.value);
	setTimeout(() => {
		outputArea.classList.remove('copyanimation');
	}, 1000);
}
function copyToClipboardTwo() {
	outputAreaDup.classList.add('copyanimation');
	navigator.clipboard.writeText(outputAreaDup.value);
	setTimeout(() => {
		outputAreaDup.classList.remove('copyanimation');
	}, 1000);
}

function convertBoth() {
	convertInputToInvoices(inputAreaDup, inputAreaDup);
	convertInputToInvoices(inputAreaDupDup, inputAreaDupDup);
	findMissing();
}

function sumInvoices() {
	const inv = [];
	console.log(inputForSum.value);
	let text = inputForSum.value.split('\n');
	text.splice(0, 22);
	text.pop();
	text.pop();
	text.pop();
	console.log(text);

	class Invoices {
		constructor(number, due, amount) {
			this.number = number;
			this.due = due;
			this.amount = amount;
		}
	}
	console.log(text[6]);
	for (let i = 0; i < text.length; i += 10) {
		inv.push(new Invoices(text[i], text[i + 6], parseFloat(text[i + 7].replace(/[^0-9.]+/g, ''))));
	}
	console.log(inv);
	let sum = 0;
	inv.forEach(element => {
		outputForSum.textContent += element.number + '  ' + element.due + '  ' + element.amount + '\n';
		const regex = /\d/;
		sum += element.amount;
	});
	sumOutput.textContent = 'Sum: ' + sum.toFixed(2);
}

nav.forEach(element => {
	element.addEventListener('click', () => {
		nav.forEach(element => {
			element.classList.remove('active');
		});
		element.classList.toggle('active');
	});
});

//scrollspy

(function () {
	'use strict';

	var section = document.querySelectorAll('.module');
	var sections = {};
	var i = 0;

	Array.prototype.forEach.call(section, function (e) {
		sections[e.id] = e.offsetTop;
	});

	window.onscroll = function () {
		var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

		for (i in sections) {
			if (sections[i] <= scrollPosition + 100) {
				document.querySelector('.active').setAttribute('class', ' ');
				document.querySelector('a[href*=' + i + ']').setAttribute('class', 'active');
			}
		}
	};
})();

function getOverdue() {
	outputAreaOverdue.value = 'However please note that the following invoices in your account are currently overdue:\n';
	console.log(inputAreaOverdue.value);
	let text = inputAreaOverdue.value.split('\n');
	console.log(text[0].split(' '));
	let invoicelist = [];

	class Invoice {
		constructor(invoiceNumber, dueDate, daysOverdue, totalAmount, openAmount) {
			this.invoiceNumber = invoiceNumber;
			this.dueDate = dueDate;
			this.daysOverdue = daysOverdue;
			this.totalAmount = totalAmount;
			this.openAmount = openAmount;
		}
	}
	text.forEach(element => {
		let invoice = element.split(' ');

		invoicelist.push(
			new Invoice(
				invoice[0],
				invoice[invoice.length - 5],
				invoice[invoice.length - 4],
				invoice[invoice.length - 2],
				invoice[invoice.length - 1]
			)
		);
	});

	let overdue = [];
	invoicelist.forEach(element => {
		if (element.daysOverdue > 6) {
			overdue.push(element);
		}
	});

	overdue.forEach(element => {
		if (element.totalAmount === element.openAmount) {
			outputAreaOverdue.value += `${element.invoiceNumber} due date ${element.dueDate}\n`;
		} else {
			outputAreaOverdue.value += `${element.invoiceNumber} underpaid in the amount of ${element.openAmount} ${currency.value} \n`;
		}
	});

	console.log(overdue);
}

submitButton.addEventListener('click', submitButtonHandler);
submitButton2.addEventListener('click', convertBoth);
submitButton3.addEventListener('click', sumInvoices);
submitButton4.addEventListener('click', getOverdue);
outputArea.addEventListener('click', copyToClipboard);
outputAreaDup.addEventListener('click', copyToClipboardTwo);
