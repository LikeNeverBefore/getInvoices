const inputArea = document.querySelector('#input');
const outputArea = document.querySelector('#output');
const submitButton = document.querySelector('#submit');
const outputLabel = document.querySelector('#outputlabel');

let userInput = '';

function submitButtonHandler() {
	userInput = inputArea.value.split(' ');
	console.log(userInput);
	outputArea.value = userInput.filter(filterArray);
	outputLabel.textContent = 'Output: ' + userInput.filter(filterArray).length + ' invoices';
}

let dummyText =
	'4123456787 due date 30-01-2023 4123452787 due date 30-01-2023 4123456787 due date 30-01-2023 4023456787 due date 30-01-2023 4123452387 due date 30-01-2023 4123456487 due date 30-01-2023 4123956787 due date 30-01-2023 4123400787 due date 30-01-2023 ';
inputArea.value = dummyText;
const outputDummy = dummyText.split(' ');

function filterArray(item) {
	if (item.length == 10) {
		if ((item > 3700000000) & (item < 4900000000)) {
			return true;
		}
	} else {
		return false;
	}
}

console.log(outputDummy.filter(filterArray));

submitButton.addEventListener('click', submitButtonHandler);

//
