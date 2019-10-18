#!/usr/bin/env/ node

const inquirer = require('inquirer')
const fs = require('fs')

const FRONTEND_CHOICES = fs.readdirSync(`${__dirname}/../templates/frontend`)
const BACKEND_CHOICES = fs.readdirSync(`${__dirname}/../templates/backend`)
const CURR_DIR = process.cwd()

const QUESTIONS = [
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: function(input) {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true
            else return 'Project name may only include letters, numbers, underscores and hashes.'
        }
    },
    {
        name: 'frontend-choice',
        type: 'list',
        message: 'What library would you like to use for your frontend?',
        choices: FRONTEND_CHOICES
    },
    {
        name: 'backend-choice',
        type: 'list',
        message: 'What library would you like to use for your backend?',
        choices: BACKEND_CHOICES
    }
]

inquirer.prompt(QUESTIONS).then(answers => {
    const frontendChoice = answers['frontend-choice']
    const backendChoice = answers['backend-choice']
    const projectName = answers['project-name']
    const frontendTemplatePath = `${__dirname}/../templates/frontend/${frontendChoice}`
    const backendTemplatePath = `${__dirname}/../templates/backend/${backendChoice}`

    fs.mkdirSync(`${CURR_DIR}/${projectName}`)

    createDirectoryContents(frontendTemplatePath, projectName)
    createDirectoryContents(backendTemplatePath, projectName)
})

function createDirectoryContents(templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath)

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`

        // get stats about the current file
        const stats = fs.statSync(origFilePath)

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8')
            if (file === '.npmignore') file = '.gitignore'

            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`

            fs.writeFileSync(writePath, contents, 'utf8')
        } 
        else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`)

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`)
        }
    })
}
