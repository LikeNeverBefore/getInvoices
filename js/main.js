// Module for finding invoice numbers from raw text
const findInvoicesInput = document.querySelector('#findInvoicesInput');
const findInvoicesOutput = document.querySelector('#findInvoicesOutput');
const findInvoicesBtn = document.querySelector('#findInvoicesBtn');
const findInvoicesLabel = document.querySelector('#findInvoicesLabel');
const findInvoicesRemitLabel = document.querySelector('#findInvoicesRemitLabel');

let duplicateInvoices = 0;

// Module for finding missing invoices (located on different account)
const findMissingInputOne = document.querySelector('#findMissingInputOne');
const findMissingInputTwo = document.querySelector('#findMissingInputTwo');
const findMissingOutput = document.querySelector('#findMissingOutput');
const findMissingBtn = document.querySelector('#findMissingBtn');

// Module for formatting invoices and returning the sum
const inputSumInvoices = document.querySelector('#inputSumInvoices');
const outputSumInvoices = document.querySelector('#outputSumInvoices');
const btnSumInvoices = document.querySelector('#btnSumInvoices');
const sumOutput = document.querySelector('#sumoutput');

// Module for generating an overdue reminder
const inputOverdueInvoices = document.querySelector('#inputOverdueInvoices');
const outputOverdueInvoices = document.querySelector('#outputOverdueInvoices');
const btnOverdueInvoices = document.querySelector('#btnOverdueInvoices');

// Module for generating invoice - amounts list from bex matching
const inputMatching = document.querySelector('#inputMatching');
const inputMatchingTwo = document.querySelector('#inputMatchingTwo');
const outputMatching = document.querySelector('#outputMatching');
const outputMatchingTwo = document.querySelector('#outputMatchingTwo');
const btnMatching = document.querySelector('#btnMatching');
const btnMatchingTwo = document.querySelector('#btnMatchingTwo');

// DOM manipulation + scrollspy
const nav = document.querySelectorAll('a');
const activePage = window.location.pathname;

// Function accesses the text entered by user
// It does some text manipulation splitting the entered text by - space, new line, tabulator, comma - and stores the result in an userInput array
// Then it check every element in userInput array and transfers every number that's exactly 10 digit long to foundNumbers array
// Then the additional check is pushing every number from range of 3600000000 - 5100000000 to foundInvoices array
// Finally the invoices are then transferred to uniqueInvoices Set to remove any potential duplicates

function convertInputToInvoices(input, output) {
	const regex = /\d{10}/; // Regex to only accept numbers that are exactly 10 digits long
	const regexSap = /\d{9}/; // Regex to only accept numbers that are exactly 10 digits long

	const foundNumbers = [];
	const sapNumbers = [];
	const foundInvoices = [];

	function removeLeadingZeroes(arr) {
		return arr.map(item => {
			if (typeof item === 'string') {
				// For strings, remove leading zeroes using a regular expression
				return item.replace(/^0+/, '');
			} else if (typeof item === 'number') {
				// For numbers, convert to string, remove leading zeroes, then convert back to number
				return Number(item.toString().replace(/^0+/, ''));
			} else {
				// For other data types, return the item unchanged
				return item;
			}
		});
	}

	let userInput = input.value;
	userInput = userInput.replace(/[^a-zA-Z0-9]/g, ' ');
	userInput = userInput.split(' ');
	console.log(userInput);
	userInput = removeLeadingZeroes(userInput);

	// French invoices
	userInput.forEach(element => {
		if (element.includes('GCFRD')) {
			foundInvoices.push(element);
		}
	});

	userInput.forEach(element => {
		if (element.includes('GCFRC')) {
			foundInvoices.push(element);
		}
	});

	// Italy invoices
	userInput.forEach(element => {
		if (element.includes('GCITD')) {
			foundInvoices.push(element);
		}
	});
	userInput.forEach(element => {
		if (element.includes('GCITC')) {
			foundInvoices.push(element);
		}
	});

	///////////////////////////////////////////////////////////// HANDLING SAP INVOICES ///////////////////////////////////////////////////////////////////////////

	// Loop to push 9 digit numbers to sapInvoices
	userInput.forEach(element => {
		if (regexSap.test(element)) {
			sapNumbers.push(element);
		}
	});

	for (let i = 0; i < sapNumbers.length; i++) {
		sapNumbers[i] = sapNumbers[i].toString().replace(/\D/g, '');
	}

	// Loop to push numbers from range of 100000000 - 200000000 to foundInvoices array
	for (let i = 0; i < sapNumbers.length; i++) {
		if (sapNumbers[i] > 100000000 && sapNumbers[i] < 200000000) {
			foundInvoices.push(sapNumbers[i]);
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////// HANDLING B3J INVOICES ///////////////////////////////////////////////////////////////////////////

	// Loop to push 10 digit numbers to foundNumbers
	userInput.forEach(element => {
		if (regex.test(element)) {
			foundNumbers.push(element);
		}
	});

	for (let i = 0; i < foundNumbers.length; i++) {
		foundNumbers[i] = foundNumbers[i].toString().replace(/\D/g, '');
	}

	// Loop to push numbers from range of 3600000000 - 5300000000 to foundInvoices array
	for (let i = 0; i < foundNumbers.length; i++) {
		if (foundNumbers[i] > 3600000000 && foundNumbers[i] < 5300000000) {
			foundInvoices.push(foundNumbers[i]);
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Creating new Set from foundInvoices to remove duplicates
	const uniqueInvoices = [...new Set(foundInvoices)];

	// Some text manipulation to include a space after every invoice starting from the second one - just for formatting purposes.
	for (let i = 1; i < uniqueInvoices.length; i++) {
		uniqueInvoices[i] = ' ' + uniqueInvoices[i];
	}

	// Pasting the final invoice list to the output field
	output.value = uniqueInvoices;
	duplicateInvoices = foundInvoices.length;

	return uniqueInvoices;
}

// Function attached to button handler that runs convertInputToInvoices(findInvoicesInput, findInvoicesOutput) and manipulates label to contain the information on number of found invoices and possible duplicates
function findInvoicesBtnHandler() {
	let unique = convertInputToInvoices(findInvoicesInput, findInvoicesOutput);
	findInvoicesLabel.textContent =
		'Output: ' + unique.length + ' invoices (' + (duplicateInvoices - unique.length) + ' duplicates removed)';
	findMissingInputOne.textContent = findInvoicesOutput.value;
}

// Function that checks which input have more invoices, then finds the values that only appear once and pushes them to missingInvoices array
function findMissing() {
	let longerArray;
	let shorterArray;
	let missingInvoices = [];

	if (findMissingInputOne.value.length > findMissingInputTwo.value.length) {
		longerArray = findMissingInputOne.value;
		shorterArray = findMissingInputTwo.value;
	} else {
		longerArray = findMissingInputTwo.value;
		shorterArray = findMissingInputOne.value;
	}

	longerArray = longerArray.split(' ');
	longerArray = longerArray.join();
	longerArray = longerArray.split(',');

	shorterArray = shorterArray.split(' ');
	shorterArray = shorterArray.join();
	shorterArray = shorterArray.split(',');

	longerArray.forEach(element => {
		if (!shorterArray.includes(element)) {
			missingInvoices.push(element);
		}
	});

	// Some text manipulation to include a space after every invoice starting from the second one - just for formatting purposes.
	for (let i = 1; i < missingInvoices.length; i++) {
		missingInvoices[i] = ' ' + missingInvoices[i];
	}

	findMissingOutput.value = missingInvoices;
}

function copyToClipboard() {
	findInvoicesOutput.classList.add('copyanimation');
	navigator.clipboard.writeText(findInvoicesOutput.value);
	setTimeout(() => {
		findInvoicesOutput.classList.remove('copyanimation');
	}, 1000);
}

function copyToClipboardTwo() {
	findMissingOutput.classList.add('copyanimation');
	navigator.clipboard.writeText(findMissingOutput.value);
	setTimeout(() => {
		findMissingOutput.classList.remove('copyanimation');
	}, 1000);
}

// Runs convertInputToInvoices on both input fields and then runs findMissing
function convertBoth() {
	convertInputToInvoices(findMissingInputOne, findMissingInputOne);
	convertInputToInvoices(findMissingInputTwo, findMissingInputTwo);
	findMissing();
}

// Function that does text manipulation to populate the invoice based on class constructor
// Then it calculates days past due and sum for each currency code
function sumInvoices() {
	let userInput = inputSumInvoices.value.split('\n');
	if (userInput[userInput.length - 1] !== 'east') {
		outputSumInvoices.textContent = '';
		sumOutput.textContent = 'Error, please check the input';
		alert('Incorrect input. Please double check to continue');
	} else {
		const invoices = [];
		const currencySet = new Set([]);

		class Invoices {
			constructor(invoiceNumber, invoiceDate, dueDate, totalAmount, openAmount, currency, daysPastDue) {
				this.invoiceNumber = invoiceNumber;
				this.invoiceDate = invoiceDate;
				this.dueDate = dueDate;
				this.totalAmount = totalAmount;
				this.openAmount = openAmount;
				this.currency = currency;
				this.daysPastDue = daysPastDue;
			}
		}

		while (userInput.includes('east')) {
			const findPaid = element => element === 'east';
			let indexOfPaid = userInput.findIndex(findPaid);
			let invoiceArray = userInput.splice(0, indexOfPaid + 1);

			// invoice number
			let invoiceNumber = invoiceArray[0];

			// invoice date
			let invoiceDate = [...invoiceArray[invoiceArray.length - 5].split('\t')];
			invoiceDate = invoiceDate[invoiceDate.length - 2];

			// invoice due date
			let dueDate = invoiceArray[invoiceArray.length - 4];

			// invoice total amount
			let invoiceAmount = invoiceArray[invoiceArray.length - 3];
			invoiceAmount = invoiceAmount.substring(0, invoiceAmount.length - 4);
			invoiceAmount = parseFloat(invoiceAmount.replace(/,/g, '')).toFixed(2);
			invoiceAmount = parseFloat(invoiceAmount);

			// invoice open amount
			let openAmount = invoiceArray[invoiceArray.length - 2];
			openAmount = openAmount.substring(0, openAmount.length - 4);
			openAmount = parseFloat(openAmount.replace(/,/g, ''));

			// currency code
			let currency = invoiceArray[invoiceArray.length - 2].substring(invoiceArray[invoiceArray.length - 2].length - 3);

			// list of currencies
			currencySet.add(currency);

			// calculating days past due
			let issueDateFull = new Date(dueDate);
			let today = new Date();
			let daysPastDue = (today - issueDateFull) / 1000 / 60 / 60 / 24;
			daysPastDue = parseInt(daysPastDue);

			let invoice = new Invoices(invoiceNumber, invoiceDate, dueDate, invoiceAmount, openAmount, currency, daysPastDue);
			invoices.push(invoice);
		}

		// Generating input for both label and output field

		sumOutput.textContent = 'Sum |  ';
		outputSumInvoices.textContent = '';
		currencySet.forEach(element => {
			currencyCode = element;
			let currencySum = 0;
			invoices.forEach(element => {
				if (element.currency == currencyCode) {
					outputSumInvoices.textContent +=
						element.invoiceNumber +
						' due date: ' +
						element.dueDate +
						' open in the amount of ' +
						element.openAmount.toFixed(2) +
						' ' +
						element.currency +
						' \n';
					currencySum += element.openAmount;
				}
			});
			sumOutput.textContent += +currencySum.toFixed(2) + ' ' + element + ' | ';
		});
	}
}

// nav handling + scrollspy

nav.forEach(element => {
	element.addEventListener('click', () => {
		nav.forEach(element => {
			element.classList.remove('active');
		});
		element.classList.toggle('active');
	});
});

// (function () {
//   "use strict";

//   var section = document.querySelectorAll(".module");
//   var sections = {};
//   var i = 0;

//   Array.prototype.forEach.call(section, function (e) {
//     sections[e.id] = e.offsetTop;
//   });

//   window.onscroll = function () {
//     var scrollPosition =
//       document.documentElement.scrollTop || document.body.scrollTop;

//     for (i in sections) {
//       if (sections[i] <= scrollPosition + 110) {
//         document.querySelector(".active").setAttribute("class", " ");
//         document
//           .querySelector("a[href*=" + i + "]")
//           .setAttribute("class", "active");
//       }
//     }
//   };
// })();

// Function that does text manipulation to populate the invoice based on class constructor
// Then it calculates days past due obtaining invoice status and dispute status
// Based on the following conditions it generates an output
// If the invoice is >7 days overdue the status is different then skippedStatuses and the dispute is not active or pending then the invoice is pushed to overdue array
// From overdue array - if the invoice is partially paid the the output says invoiceNumber remains open in the amount of openAmount else it shows invoiceNumber due date dueDate

function getOverdue() {
	let userInput = inputOverdueInvoices.value.split('\n');
	if (userInput[userInput.length - 1] !== 'east') {
		outputOverdueInvoices.textContent = '';
		alert('Incorrect input. Please double check to continue');
	} else {
		const invoices = [];

		class Invoices {
			constructor(invoiceNumber, invoiceDate, dueDate, totalAmount, openAmount, currency, daysPastDue, status, disputed) {
				this.invoiceNumber = invoiceNumber;
				this.invoiceDate = invoiceDate;
				this.dueDate = dueDate;
				this.totalAmount = totalAmount;
				this.openAmount = openAmount;
				this.currency = currency;
				this.daysPastDue = daysPastDue;
				this.status = status;
				this.disputed = disputed;
			}
		}

		while (userInput.includes('east')) {
			const findPaid = element => element === 'east';
			let indexOfPaid = userInput.findIndex(findPaid);
			let invoiceArray = userInput.splice(0, indexOfPaid + 1);

			// invoice number
			let invoiceNumber = invoiceArray[0];

			// invoice date
			let invoiceDate = [...invoiceArray[invoiceArray.length - 5].split('\t')];
			invoiceDate = invoiceDate[invoiceDate.length - 2];

			// invoice due date
			let dueDate = invoiceArray[invoiceArray.length - 4];

			// invoice total amount
			let invoiceAmount = invoiceArray[invoiceArray.length - 3];
			invoiceAmount = invoiceAmount.substring(0, invoiceAmount.length - 4);
			invoiceAmount = parseFloat(invoiceAmount.replace(/,/g, '')).toFixed(2);
			invoiceAmount = parseFloat(invoiceAmount);

			// invoice open amount
			let openAmount = invoiceArray[invoiceArray.length - 2];
			openAmount = openAmount.substring(0, openAmount.length - 4);
			openAmount = parseFloat(openAmount.replace(/,/g, ''));

			// currency code
			let currency = invoiceArray[invoiceArray.length - 2].substring(invoiceArray[invoiceArray.length - 2].length - 3);

			// calculating days past due
			let issueDateFull = new Date(dueDate);
			let today = new Date();
			let daysPastDue = (today - issueDateFull) / 1000 / 60 / 60 / 24;
			daysPastDue = parseInt(daysPastDue);

			// obtaining invoice status
			const findEdit = element => element === 'edit';
			let indexOfEdit;
			indexOfEdit = invoiceArray.findIndex(findEdit);
			let status;
			if (
				invoiceArray[indexOfEdit - 1] == 'Disputed' ||
				invoiceArray[indexOfEdit - 1] == 'Proof Of Payment' ||
				invoiceArray[indexOfEdit - 1] == 'Promise To Pay' ||
				invoiceArray[indexOfEdit - 1] == 'Unpaid Agency' ||
				invoiceArray[indexOfEdit - 1] == 'Received Not Applied' ||
				invoiceArray[indexOfEdit - 1] == 'On Payment Plan' ||
				invoiceArray[indexOfEdit - 1] == 'Credit Issue' ||
				invoiceArray[indexOfEdit - 1] == 'In Query' ||
				invoiceArray[indexOfEdit - 1] == 'Withholding Tax' ||
				invoiceArray[indexOfEdit - 1] == 'Uncollectible' ||
				invoiceArray[indexOfEdit - 1] == 'In Serasa' ||
				invoiceArray[indexOfEdit - 1] == 'Deferred Payment Agreed' ||
				invoiceArray[indexOfEdit - 1] == 'Deduction Pending'
			) {
				status = invoiceArray[indexOfEdit - 1];
			} else {
				status = 'None';
			}

			// obtaining dispute status
			let disputed;
			if (invoiceArray[indexOfEdit + 1] == 'Active') {
				disputed = 'Active';
			} else if (invoiceArray[indexOfEdit + 1] == 'Pending') {
				disputed = 'Pending';
			} else {
				disputed = 'None';
			}

			let invoice = new Invoices(
				invoiceNumber,
				invoiceDate,
				dueDate,
				invoiceAmount,
				openAmount,
				currency,
				daysPastDue,
				status,
				disputed
			);
			invoices.push(invoice);
			indexOfPaid = invoiceArray.findIndex(findPaid);
		}

		const overdue = [];

		invoices.forEach(element => {
			const skippedStatuses = [
				'Disputed',
				'Proof Of Payment',
				'Unpaid Agency',
				'Received Not Applied',
				'On Payment Plan',
				'Credit Issue',
				'Withholding Tax',
				'Uncollectible',
				'In Serasa',
				'Deferred Payment Agreed',
				'Deduction Pending',
			];
			if (element.daysPastDue > 7 && !skippedStatuses.includes(element.status) && element.disputed == 'None') {
				overdue.push(element);
			}
		});
		if (overdue.length === 1) {
			outputOverdueInvoices.textContent = "However, please note that in your account there's one overdue invoice ";
			overdue.forEach(element => {
				if (element.openAmount == element.totalAmount) {
					outputOverdueInvoices.textContent += `${element.invoiceNumber} with a due date of ${element.dueDate}.\n`;
				} else {
					outputOverdueInvoices.textContent += `${
						element.invoiceNumber
					} underpaid in the amount of ${element.openAmount.toFixed(2)} ${element.currency} \n`;
				}
			});
		} else {
			outputOverdueInvoices.textContent =
				'However, please note that the following invoices in your account are currently overdue: \n';
			overdue.forEach(element => {
				if (element.openAmount == element.totalAmount) {
					let ov = document.createElement('li');
					ov.textContent = `${element.invoiceNumber} due date ${element.dueDate}\n`;
					outputOverdueInvoices.appendChild(ov);
				} else {
					let ov = document.createElement('li');
					ov.textContent += `${element.invoiceNumber} underpaid in the amount of ${element.openAmount.toFixed(2)} ${
						element.currency
					} \n`;
					outputOverdueInvoices.appendChild(ov);
				}
			});
		}
		const overdueCr = document.createElement('p');
		const duringSusCr = document.createElement('p');
		const validCr = document.createElement('p');
		const validPop = document.createElement('a');
		const onceCr = document.createElement('p');

		overdueCr.textContent = `Therefore, we ask for a valid proof of payment which will help you avoid any potential suspension process. Please follow the below definition:`;
		validCr.textContent = `A valid proof of payment is either a bank confirmation or a copy of the check (with a tracking number) containing all the necessary details listed `;
		validCr.setAttribute('id', 'bold');
		onceCr.textContent = `Once we receive`;
		validPop.textContent = 'here.';
		validPop.href =
			'https://support.google.com/paymentscenter/answer/9034625?visit_id=637254795938999845-52541193&rd=1#proof/';

		if (document.getElementById('overdueRadio').checked) {
			outputOverdueInvoices.appendChild(overdueCr);
			outputOverdueInvoices.appendChild(validCr);
			validCr.appendChild(validPop);
		} else {
			if (overdue.length === 1) {
				duringSusCr.textContent = `{If/As} you've been notified that your account is at risk of suspension, please email us a valid proof of payment covering your overdue invoice.`;
				outputOverdueInvoices.appendChild(duringSusCr);
				outputOverdueInvoices.appendChild(validCr);
				validCr.appendChild(validPop);
				outputOverdueInvoices.appendChild(onceCr);
			} else {
				duringSusCr.textContent = `{If/As} you've been notified that your account is at risk of suspension, please email us a valid proof of payment covering all of your overdue invoices.`;
				outputOverdueInvoices.appendChild(duringSusCr);
				outputOverdueInvoices.appendChild(validCr);
				validCr.appendChild(validPop);
				outputOverdueInvoices.appendChild(onceCr);
			}
		}
	}
}
function matchingHandler() {
	const invoices = [];
	const ourMatching = [];

	let userInput = inputMatching.value.split('\n');
	inputMatching.value = '';

	for (let i = 0; i < userInput.length; i++) {
		if (userInput[i].includes('Invoice')) {
			invoices.push(userInput[i].replace(/Invoice /g, ''));
			userInput[i + 1] = userInput[i + 1].replace(/,/g, '');
			userInput[i + 1] = userInput[i + 1].substring(0, userInput[i + 1].length - 4);

			invoices.push(userInput[i + 1]);
		}
	}

	for (let i = 0; i < invoices.length; i += 2) {
		inputMatching.value += invoices[i] + ' ' + invoices[i + 1] + '\n';
		ourMatching.push(invoices[i] + ' ' + invoices[i + 1]);
	}

	let checkInput = inputMatchingTwo.value.split('\n');

	inputMatchingTwo.textContent = checkInput;
}

function checkMatching() {
	let userInput = inputMatching.value.split('\n');
	let remittance = inputMatchingTwo.value.split('\n');

	for (let i = 0; i < remittance.length; i++) {
		remittance[i] = remittance[i].replace(/\t/g, ' ');
		remittance[i] = remittance[i].replace(/,/g, '');
	}
	outputMatching.value = '';
	outputMatchingTwo.value = '';

	remittance.forEach(element => {
		if (!userInput.includes(element)) {
			outputMatchingTwo.value += element + '\n';
		} else {
			outputMatching.value += element + '\n';
		}
	});
}

// Button handlers
findInvoicesBtn.addEventListener('click', findInvoicesBtnHandler);
findMissingBtn.addEventListener('click', convertBoth);
btnSumInvoices.addEventListener('click', sumInvoices);
btnOverdueInvoices.addEventListener('click', getOverdue);
btnMatching.addEventListener('click', matchingHandler);
btnMatchingTwo.addEventListener('click', checkMatching);
findInvoicesOutput.addEventListener('click', copyToClipboard);
findMissingOutput.addEventListener('click', copyToClipboardTwo);
