# Effortless Lambda
A generator to quickly create a modern development environment for an AWS Lambda function.

## What Does it Do?
It generates a bare-bones ES6 Javascript project that provides helpful utilities to create, test, and publish a Node function. Instead of creating a new directory with all the boilerplate and configuring [Babel](https://babeljs.io/), [ESLint](https://eslint.org/), and [testing](https://jestjs.io/) each and every time, you can have these things automatically configured for you. Take a look inside the `template` folder to get an idea of what is provided.

It can also [Webpack](https://webpack.js.org/) and zip your final bundle making it easy to simply upload the final file to [AWS](https://aws.amazon.com/). 

## How Do I Get Started?
No need to install anything, just run:
```
npx effortless-lambda
```
It will ask you for four pieces of information:
1. Name of the project
2. Name of the author
3. A description of your project (optional)
4. What linting ruleset you'd like to use (StandardJS, Google, None)

Answer these questions, `cd` into the newly created directory and open it up in your code editor.

## How Do I Use It?
Any changes to the `src/` folder are what will be considered part of your final project. You can also make changes to the `testParameters.js` file at the root if you'd like to run your project locally (the script to do so is below) and pass your own parameters without accidentally wrapping them into your final product.

There's a couple pre-configured `npm` scripts that will help speed some things up:

- `npm run start`: Builds your `src/` folder and runs your project with the parameters supplied in `testParameters.js`.
- `npm run build`: Runs `webpack` on your project and outputs the contents to a `dist/` folder.
- `npm run lint:configure`: Prompts the default ESLint configuration questions to resset/initialize your linting rules.
- `npm run test`: Runs all of your Jest tests.
- `npm run zip <NAME-OF-ARCHIVE>`: Zips your built project and outputs it as a `.zip` file with the name you provided in this command in a `zipUpload/` folder at the root. If you don't pass a name at the time of the command, it will fall back to the `name` property in your `package.json`.