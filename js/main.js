const inputArea = document.querySelector('#input');
const outputArea = document.querySelector('#output');
const submitButton = document.querySelector('#submit');
const outputLabel = document.querySelector('#outputlabel');
const regex = /\d{10}/;

function submitButtonHandler() {
	const final = [];
	let text = inputArea.value.split(' ');

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
	outputArea.value = unique;

	outputLabel.textContent = 'Output: ' + unique.length + ' invoices';
}

submitButton.addEventListener('click', submitButtonHandler);
