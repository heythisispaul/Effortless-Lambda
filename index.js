#!/usr/bin/env node
const inquirer      = require('inquirer');
const fs            = require('fs');
const ora           = require('ora');
const chalk         = require('chalk');
const child_process = require('child_process');
const lintFixes     = require('./utils/lintFixes');
const buildReadMe   = require('./utils/buildReadMe');
const questions     = require('./utils/inquirerQuestions');

const currentDirectory = process.cwd();

const init = async () => {
  let answers;
  let lintStyle;
  console.log(chalk.yellow.bold('*******************************************'));
  console.log(chalk.yellow.bold('****** Welcome to Effortlesss Lambda ******'));
  console.log(chalk.yellow.bold('*******************************************'));
  try {
    const initialAnswers = await inquirer.prompt(questions.starterQuestions);
    const lintQuestions = initialAnswers.typescript ? await inquirer.prompt(questions.tsLint) : await inquirer.prompt(questions.jsLint);
    answers = { ...initialAnswers, ...lintQuestions };
  } catch (err) {
    console.log(err);
  }

  const buildFilesSpinner = ora('Building your integration').start();
  const installDependencies = ora('Installing dependencies');
  const { projectName, author, description, typescript, lint } = answers;

  try {
    fs.mkdirSync(`${currentDirectory}/${projectName}`);
    lintStyle = typescript && lint ? 4 : lint;
    createContents(`${__dirname}/${answers.typescript ? 'ts-' : 'js-'}template`, projectName, lintStyle);
  } catch (err) {
    buildFilesSpinner.fail(err);
    process.exit(1);
  }

  try {
    //update package.json
    const packageInfo = fs.readFileSync(`${currentDirectory}/${projectName}/package.json`, 'utf8');
    const packageJSON = JSON.parse(packageInfo);
    packageJSON.author = author;
    packageJSON.description = description;
    packageJSON.name = projectName;
    if (lintStyle === 1) {
      packageJSON.devDependencies['eslint-config-standard'] = 'latest';
    }
    if (lintStyle === 2) {
      packageJSON.devDependencies['eslint-config-google'] = 'latest';
    }
    if (lintStyle === 4) {
      packageJSON.devDependencies['@typescript-eslint/eslint-plugin'] = 'latest';
    }
    fs.writeFileSync(`${currentDirectory}/${projectName}/package.json`, JSON.stringify(packageJSON), 'utf8');
    fs.writeFileSync(`${currentDirectory}/${projectName}/README.md`, buildReadMe(projectName, description), 'utf8');
    console.log();
    buildFilesSpinner.succeed('Files Generated');
    console.log();
    installDependencies.start();
    console.log();
    child_process.execSync(`cd ${projectName} && npm install`);
    installDependencies.succeed('Dependencies installed');
    console.log();
  } catch (err) {
    buildFilesSpinner.fail();
    installDependencies.fail(err);
    process.exit(1);
  }
  eslintrc(lintStyle, projectName);
  console.log();
  console.log(chalk.green.bold('All Set!'));
  console.log(`just run ${chalk.magenta.bold(`cd ${projectName}`)} and open up your editor to get started.`);
  console.log(`Thanks for using ${chalk.cyan('Effortless Lambda!')} Happy coding!`);
};

const createContents = (templatePath, newProjectPath, linting) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, 'utf8');
      file = file === '.npmignore' ? '.gitignore' : file;
      
      const writePath = `${currentDirectory}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, lintFixes(file, contents, linting), 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${currentDirectory}/${newProjectPath}/${file}`);
      
      createContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`, linting);
    }
  });
};

const eslintrc = (lint, projectName) => {
  const eslintPath = `${currentDirectory}/${projectName}/.eslintrc.json`;
  const contents = () => {
    if (lint === 4) {
      return {
        "parser": "@typescript-eslint/parser",
        "plugins": ["@typescript-eslint"],
        "extends": ["plugin:@typescript-eslint/recommended"]
      }
    } else {
      return {
        "extends": lint === 1 ? "standard" : ["eslint:recommended", "google"],
        "parser": "babel-eslint"
      };
    }
  }

  if (lint === 1 || lint === 2 || lint === 4) {
    fs.writeFileSync(eslintPath, JSON.stringify(contents()), 'utf8');
  }
};

init();