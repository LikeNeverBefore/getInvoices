const inputArea = document.querySelector('#input');
const inputAreaDup = document.querySelector('#input2');
const inputAreaDupDup = document.querySelector('#input3');
const inputForSum = document.querySelector('#input4');
const outputArea = document.querySelector('#output');
const outputAreaDup = document.querySelector('#output2');
const outputForSum = document.querySelector('#output3');
const submitButton = document.querySelector('#submit');
const submitButton2 = document.querySelector('#submit2');
const submitButton3 = document.querySelector('#submit3');
const outputLabel = document.querySelector('#outputlabel');
const sumOutput = document.querySelector('#sumoutput');
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
	outputLabel.textContent =
		'Output: ' +
		unique.length +
		' invoices (' +
		duplicates +
		' duplicates removed)';
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

submitButton.addEventListener('click', submitButtonHandler);
submitButton2.addEventListener('click', convertBoth);
submitButton3.addEventListener('click', sumInvoices);
outputArea.addEventListener('click', copyToClipboard);
outputAreaDup.addEventListener('click', copyToClipboardTwo);
