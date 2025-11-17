// JavaScript Test Document for Domain Detection
// This file contains various JavaScript keywords and concepts

// Variables
let userName = "John";
var age = 25;
const MAX_USERS = 100;

// Functions
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function
const calculateTotal = (a, b) => a + b;

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
const filtered = numbers.filter((n) => n > 2);

// Object
const user = {
  name: "Jane",
  email: "jane@example.com",
  age: 30,
};

// Async/await
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 1000);
});

// Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

// Destructuring
const { name, email } = user;
const [first, second] = numbers;

// Spread operator
const newArray = [...numbers, 6, 7, 8];
const newObject = { ...user, city: "New York" };

// Template literals
const message = `User ${name} is ${age} years old`;

// For loop
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// Event listener
document.addEventListener("click", function (event) {
  console.log("Clicked!", event.target);
});
