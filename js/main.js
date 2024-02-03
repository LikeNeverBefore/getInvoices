const inputArea = document.querySelector('#input');
const inputAreaDup = document.querySelector('#input2');
const inputAreaDupDup = document.querySelector('#input3');
const outputArea = document.querySelector('#output');
const outputAreaDup = document.querySelector('#output2');
const submitButton = document.querySelector('#submit');
const submitButton2 = document.querySelector('#submit2');
const outputLabel = document.querySelector('#outputlabel');
const regex = /\d{10}/;

function convertInputToInvoices(input) {
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
	outputArea.value = ' ';

	for (let i = 1; i < unique.length; i++) {
		unique[i] = ' ' + unique[i];
	}
	return unique;
}

function submitButtonHandler() {
	let unique = convertInputToInvoices(inputArea);
	outputArea.value = convertInputToInvoices(inputArea);

	outputLabel.textContent = 'Output: ' + unique.length + ' invoices' /*+ '( ' + final.length + ' with duplicates)'*/;
	inputAreaDup.textContent = outputArea.value;
}
function findMissing() {
	let more;
	let less;
	let missing = [];
	inputAreaDupDup.value = convertInputToInvoices(inputAreaDupDup);

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
	console.log(typeof more);
	console.log(less);
	more.forEach(element => {
		if (!less.includes(element)) {
			missing.push(element);
		}
	});
	outputAreaDup.value = missing;
}

submitButton.addEventListener('click', submitButtonHandler);
submitButton2.addEventListener('click', findMissing);
