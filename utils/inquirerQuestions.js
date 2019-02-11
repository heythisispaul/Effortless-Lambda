
const starterQuestions = [
  {
    name: 'projectName',
    type: 'input',
    message: 'Project Name:',
    validate: (input) => /^([A-Za-z\-\_\d])+$/.test(input) ? true : 'Name can only include letters, numbers, hashes, and underscores.'
  },
  {
      name: 'author',
      type: 'input',
      message: 'Author:',
      validate: (input) => /^[a-z ]+$/i.test(input) ? true : 'Can only include letters'
  },
  {
      name: 'description',
      type: 'input',
      message: 'Your project description:'
  },
  {
    name: 'typescript',
    type: 'confirm',
    message: 'Would you like to use TypeScript?'
  }
];

const jsLint = [
  {
    name: 'lint',
    type: 'list',
    choices: [{ name: "Standard", value: 1 }, { name: "Google (Mac/Linux configuration)", value: 2 }, { name: "I'll Do This Later", value: 3 }],
    message: "What ESLint configuration would you like to use?"
  }
];

const tsLint = [
  {
    name: 'lint',
    type: 'confirm',
    message: "Would you like to use the Typescript-eslint-parser linting configuration?"
  }
];

module.exports = { starterQuestions, jsLint, tsLint };