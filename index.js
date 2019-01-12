#!/usr/bin/env node
const inquirer      = require('inquirer');
const fs            = require('fs');
const ora           = require('ora');
const chalk         = require('chalk');
const child_process = require('child_process');

const QUESTIONS = [
    {
        name: 'projectName',
        type: 'input',
        message: 'Integration Name:',
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
        name: 'lint',
        type: 'list',
        choices: [{ name: "Standard", value: 1 }, { name: "Google", value: 2 }, { name: "I'll Do This Later", value: 3 }],
        message: "What ESLint configuration would you like to use?"
    }
];

const currentDirectory = process.cwd();
console.log(chalk.yellow.bold('************************************'));
console.log(chalk.yellow.bold('*Welcome to the Integration Station*'));
console.log(chalk.yellow.bold('************************************'));
inquirer.prompt(QUESTIONS)
    .then(answers => {
        const projectName = answers.projectName;
        const authorName = answers.author;
        const description = answers.description;
        const lintStyle = answers.lint;
        const buildFilesSpinner = ora('Building your integration').start();
        const installDependencies = ora('Installing dependencies');
        console.log();
        try {
            fs.mkdirSync(`${currentDirectory}/${projectName}`);
            createContents(`${__dirname}/template`, projectName);
        } catch (err) {
            buildFilesSpinner.fail(err);
        }

        try {
            //update package.json
            const packageInfo = fs.readFileSync(`${currentDirectory}/${projectName}/package.json`, 'utf8');
            const packageJSON = JSON.parse(packageInfo);
            packageJSON.author = authorName;
            packageJSON.description = description;
            packageJSON.name = projectName;
            fs.writeFileSync(`${currentDirectory}/${projectName}/package.json`, JSON.stringify(packageJSON), 'utf8');
            buildFilesSpinner.succeed('Files Generated');
            console.log();
            installDependencies.start();
            console.log();
            child_process.execSync(`cd ${projectName} && npm install`);
            installDependencies.succeed('Dependencies installed');
            console.log();
        } catch (err) {
            installDependencies.fail(err);
        }

        eslintrc(lintStyle, projectName);
        console.log();
        console.log(chalk.green.bold('All Set!'));
        console.log(`just run ${chalk.magenta.bold(`cd ${projectName}`)} to get started`);
})
.catch(err => console.log(err));

const createContents = (templatePath, newProjectPath) => {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;
        const stats = fs.statSync(origFilePath);
    
        if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, 'utf8');
        
        const writePath = `${currentDirectory}/${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
        fs.mkdirSync(`${currentDirectory}/${newProjectPath}/${file}`);
        
        createContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
};

const eslintrc = (lint, projectName) => {
    const eslintPath = `${currentDirectory}/${projectName}/.eslintrc.json`;
    const contents = {
        "extends": lint === 1 ? "standard" : ["eslint:recommended", "google"],
        "parser": "babel-eslint"
    };
    if (lint === 1 || lint === 2) {
        fs.writeFileSync(eslintPath, JSON.stringify(contents), 'utf8');
    }
};