const inquirer = require('inquirer');
const { writeFile } = require('fs').promises;
const { join } = require('path');
const { createDocument } = require('./document');
const { createLogo } = require('./logo');

class CLI {
    constructor() {
        this.title = '';
        this.logos = [];
    }
    run() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Please enter your name',
                },
            ])
            .then(({ name }) => {
                this.title = `${name}'s Logo`;
                return this.addLogo();
            })
            .then(() => {
                // sort by priority so that priority tasks come before non-priority tasks
                this.logos.sort((a, b) =>
                    a.priority === b.priority ? 0 : a.priority && !b.priority ? -1 : 1
                );
                return writeFile(
                    join(__dirname, '..', 'output', 'logo.html'),
                    createDocument(this.title, this.logos)
                );
            })
            .then(() => console.log('Created logo.html'))
            .catch((err) => {
                console.log(err);
                console.log('Oops. Something went wrong.');
            });
    }
    addLogo() {
      return inquirer
          .prompt([
              {
                  type: 'input',
                  name: 'text',
                  message: 'Enter text',
              },
              {
                  type: 'list',
                  name: 'size',
                  choices: ['small', 'medium', 'large'],
                  message: 'Enter size',
              },
              {
                  type: 'list',
                  name: 'color',
                  choices: ['red', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'blue'],
                  message: 'Enter text color',
              },
              {
                  type: 'list',
                  name: 'shape',
                  choices: ['circle', 'square', 'triangle', 'rectangle', 'oval', 'hexagon', 'heart', 'star'],
                  message: 'Enter shape',
              },
              {
                  type: 'list',
                  name: 'shapeColor',
                  choices: ['red', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'blue'],
                  message: 'Enter shape color',
              },
              {
                  type: 'list',
                  name: 'border',
                  choices: ['solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
                  message: 'Enter border style',
              },
              {
                  type: 'list',
                  name: 'borderColor',
                  choices: ['red', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'blue'],
                  message: 'Enter border color',
              },
              {
                  type: 'input',
                  name: 'backgroundColor',
                  message: 'Enter background color',
                  validate: function (input) {
                      if (input.length < 1) {
                          return 'Please enter a valid color';
                      } else {
                          return true;
                      }
                  },
              },
          ]) // <-- Corrected the position of the closing square bracket
          .then(({ text, size, priority }) => {
              this.logos.push(createLogo(text, size, priority));
              return inquirer.prompt([
                  {
                      type: 'confirm',
                      name: 'addAnother',
                      message: 'Would you like to add another Logo?',
                  },
              ]);
          })
          .then(({ addAnother }) => {
              if (addAnother) {
                  return this.addLogo();
              }
          });
  }
}
  
module.exports = CLI;
