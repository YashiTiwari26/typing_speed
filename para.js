// paragraphs.js

const paragraphs = [
  "Technology is changing the world rapidly and developers are building amazing applications every day.",

  "Learning JavaScript opens many opportunities in frontend backend and full stack development.",

  "Typing regularly can improve both your speed and accuracy over time with enough practice.",

  "Artificial intelligence and machine learning are becoming important fields in computer science.",

  "A successful programmer focuses on problem solving debugging and writing clean maintainable code.",

  "Frontend development mainly involves HTML CSS JavaScript and responsive user interface design.",

  "Open source contributions help developers gain real world experience and improve coding skills.",

  "Consistency patience and curiosity are essential qualities for becoming a great software engineer.",

  "Cloud computing allows companies to scale applications efficiently across multiple servers worldwide.",

  "Cybersecurity is important because modern systems must protect sensitive data from online threats.",
];

function getRandomParagraph() {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}