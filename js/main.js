const inputArea = document.querySelector("#input");
const inputAreaDup = document.querySelector("#input2");
const inputAreaDupDup = document.querySelector("#input3");
const inputForSum = document.querySelector("#input4");
const inputAreaOverdue = document.querySelector("#input5");
const outputArea = document.querySelector("#output");
const outputAreaDup = document.querySelector("#output2");
const outputForSum = document.querySelector("#output3");
const outputAreaOverdue = document.querySelector("#output4");
const submitButton = document.querySelector("#submit");
const submitButton2 = document.querySelector("#submit2");
const submitButton3 = document.querySelector("#submit3");
const submitButton4 = document.querySelector("#submit4");
const outputLabel = document.querySelector("#outputlabel");
const sumOutput = document.querySelector("#sumoutput");
const nav = document.querySelectorAll("a");
const activePage = window.location.pathname;
const regex = /\d{10}/;
let dup = 0;

function convertInputToInvoices(input, output) {
  const regex = /\d{10}/;
  const final = [];
  let text = input.value.split(" ");

  text = text.join();
  text = text.split("\n");
  text = text.join();
  text = text.split("\t");
  text = text.join();
  text = text.split(",");

  text.forEach((element) => {
    if (regex.test(element)) {
      final.push(element);
    }
  });

  for (let i = 0; i < final.length; i++) {
    final[i] = final[i].replace(/\D/g, "");
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
    unique[i] = " " + unique[i];
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
    "Output: " +
    unique.length +
    " invoices (" +
    duplicates +
    " duplicates removed)";
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

  more = more.split(" ");
  more = more.join();
  more = more.split(",");
  less = less.split(" ");
  less = less.join();
  less = less.split(",");
  more.forEach((element) => {
    if (!less.includes(element)) {
      missing.push(element);
    }
  });
  for (let i = 1; i < missing.length; i++) {
    missing[i] = " " + missing[i];
  }

  outputAreaDup.value = missing;
}

function copyToClipboard() {
  outputArea.classList.add("copyanimation");
  navigator.clipboard.writeText(outputArea.value);
  setTimeout(() => {
    outputArea.classList.remove("copyanimation");
  }, 1000);
}
function copyToClipboardTwo() {
  outputAreaDup.classList.add("copyanimation");
  navigator.clipboard.writeText(outputAreaDup.value);
  setTimeout(() => {
    outputAreaDup.classList.remove("copyanimation");
  }, 1000);
}

function convertBoth() {
  convertInputToInvoices(inputAreaDup, inputAreaDup);
  convertInputToInvoices(inputAreaDupDup, inputAreaDupDup);
  findMissing();
}

function sumInvoices() {
  outputForSum.textContent = "";
  let sum = 0;
  const inv = [];
  let text = inputForSum.value.split("\n");
  const findPaid = (element) => element === "paid";
  let indexOfPaid = text.findIndex(findPaid);
  class Invoices {
    constructor(
      number,
      invoiceDate,
      due,
      totalAmount,
      amount,
      currency,
      daysPastDue
    ) {
      this.number = number;
      this.invoiceDate = invoiceDate;
      this.due = due;
      this.totalAmount = totalAmount;
      this.amount = amount;
      this.currency = currency;
      this.daysPastDue = daysPastDue;
    }
  }

  while (text.includes("paid")) {
    let a = text.splice(0, indexOfPaid + 1);
    let ccode = a[a.length - 2].substring(a[a.length - 2].length - 3);
    let curr = a[a.length - 2];
    curr = curr.substring(0, curr.length - 4);
    curr = parseFloat(curr.replace(/,/g, ""));

    let invoiceDate = [...a[a.length - 5].split("\t")];

    invoiceDate = invoiceDate[invoiceDate.length - 2];
    ccode = a[a.length - 2].substring(a[a.length - 2].length - 3);

    let date = new Date(a[a.length - 4]);
    let today = new Date();
    due = (date - today) / 1000 / 60 / 60 / 24;
    due = parseInt(due);

    let invoiceAmount = a[a.length - 3];
    invoiceAmount = invoiceAmount.substring(0, invoiceAmount.length - 4);
    invoiceAmount = parseFloat(invoiceAmount.replace(/,/g, ""));

    let invoice = new Invoices(
      a[0],
      invoiceDate,
      a[a.length - 4],
      invoiceAmount,
      curr,
      ccode,
      due
    );
    inv.push(invoice);
    indexOfPaid = text.findIndex(findPaid);
  }

  sum = 0;
  inv.forEach((element) => {
    outputForSum.textContent +=
      element.number +
      " due date: " +
      element.due +
      " open in the amount of " +
      element.amount +
      " " +
      element.currency +
      " \n";
    sum += element.amount;
  });

  sumOutput.textContent = "Sum: " + sum.toFixed(2);
}

nav.forEach((element) => {
  element.addEventListener("click", () => {
    nav.forEach((element) => {
      element.classList.remove("active");
    });
    element.classList.toggle("active");
  });
});

//scrollspy

(function () {
  "use strict";

  var section = document.querySelectorAll(".module");
  var sections = {};
  var i = 0;

  Array.prototype.forEach.call(section, function (e) {
    sections[e.id] = e.offsetTop;
  });

  window.onscroll = function () {
    var scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;

    for (i in sections) {
      if (sections[i] <= scrollPosition + 100) {
        document.querySelector(".active").setAttribute("class", " ");
        document
          .querySelector("a[href*=" + i + "]")
          .setAttribute("class", "active");
      }
    }
  };
})();

function getOverdue() {
  let sum = 0;
  const inv = [];
  let text = inputAreaOverdue.value.split("\n");
  const findPaid = (element) => element === "paid";
  let indexOfPaid = text.findIndex(findPaid);
  class Invoices {
    constructor(
      number,
      invoiceDate,
      due,
      totalAmount,
      amount,
      currency,
      daysPastDue
    ) {
      this.number = number;
      this.invoiceDate = invoiceDate;
      this.due = due;
      this.totalAmount = totalAmount;
      this.amount = amount;
      this.currency = currency;
      this.daysPastDue = daysPastDue;
    }
  }

  while (text.includes("paid")) {
    let a = text.splice(0, indexOfPaid + 1);
    let ccode = a[a.length - 2].substring(a[a.length - 2].length - 3);
    let curr = a[a.length - 2];
    curr = curr.substring(0, curr.length - 4);
    curr = parseFloat(curr.replace(/,/g, ""));

    let invoiceDate = [...a[a.length - 5].split("\t")];

    invoiceDate = invoiceDate[invoiceDate.length - 2];
    ccode = a[a.length - 2].substring(a[a.length - 2].length - 3);

    let date = new Date(a[a.length - 4]);
    let today = new Date();
    due = (date - today) / 1000 / 60 / 60 / 24;
    due = parseInt(due);

    let invoiceAmount = a[a.length - 3];
    invoiceAmount = invoiceAmount.substring(0, invoiceAmount.length - 4);
    invoiceAmount = parseFloat(invoiceAmount.replace(/,/g, ""));

    let invoice = new Invoices(
      a[0],
      invoiceDate,
      a[a.length - 4],
      invoiceAmount,
      curr,
      ccode,
      due
    );
    inv.push(invoice);
    indexOfPaid = text.findIndex(findPaid);
  }

  const overdue = [];

  inv.forEach((element) => {
    if (element.daysPastDue < -7) {
      overdue.push(element);
    }
  });

  outputAreaOverdue.value =
    "However please note that the following invoices in your account are currently overdue: \n";

  overdue.forEach((element) => {
    if (element.amount == element.totalAmount) {
      outputAreaOverdue.value += `${element.number} due date ${element.due}\n`;
    } else {
      outputAreaOverdue.value += `${
        element.number
      } underpaid in the amount of ${element.amount.toFixed(2)} ${
        element.currency
      } \n`;
    }
  });
}

submitButton.addEventListener("click", submitButtonHandler);
submitButton2.addEventListener("click", convertBoth);
submitButton3.addEventListener("click", sumInvoices);
submitButton4.addEventListener("click", getOverdue);
outputArea.addEventListener("click", copyToClipboard);
outputAreaDup.addEventListener("click", copyToClipboardTwo);
