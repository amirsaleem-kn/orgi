/**
 * @author Amir Saleem
 * @description This file contains the logic for logging logs
 */

"use-strict";

const chalk = require('chalk');
const { environment } = process.env;

/**
 * @author Amir Saleem
 * @description Debugger class used for debugging during development phase, nothing will be logged in the production environment
 * @method log this method prints the argument passed in the console
 * @method fancy this method prints the argument passed in a blue colored font
 * @method error this method prints the error using console.error method, if error is of type string, then it gets printed in red coloured font with [ERROR] prefixed to it
 * @method warning this methods prints the text in an orange coloured font with [WARNING] prefixed to it
 * @method trace this method calls console.trace to trace the error till the root
 * @method multi this method can prints all the arguments passed to it. It can accept any number of arguments 
 */

class Debugger {

    static log (message) {
        if(environment != 'production') {
            console.log(message);
        }
    }
    static fancy(message) {
        if(environment != 'production'){
            console.log(chalk.blue.bold(message));
        }
    }
    static error(message) {
        if(environment != 'production') {
            if(typeof message == 'object') {
                console.error(chalk.red('[ERROR]'));
                console.error(message);
            } else {
                console.error(chalk.red(`[ERROR] ${message}`));
            }
        }
    }
    static warning(message) {
        if(environment != 'production') {
            console.log(chalk.keyword('orange')(`[WARNING] ${message}`));
        }
    }
    static trace(message) {
        if(environment != 'production') {
            console.trace(message);
        }
    }

    static multi(){
        if(environment != 'production') {
            var args = arguments;
            for (let i in arguments) {
                return {
                    warning: this.warning(arguments[i])
                }
                //console.log(arguments[i]);
            }
        }
    }
}

/**
 * @description Logger class to log errors and warnings irrespective of the environment. If you don't want to print logs in production, use Debugger instead.
 * @method log simply prints the message in the console
 * @method error this method calls console.error
 * @method warning this method prints the error prefixed with [WARNING]
 * @method trace this method calls console.trace
 */

class Logger {
    static log (message) {
        console.log(message);
    }
    static error(message) {
        if(environment != 'production') {
            if(typeof message == 'object') {
                console.error(chalk.red('[ERROR]'));
                console.error(message);
            } else {
                console.error(chalk.red(`[ERROR] ${message}`));
            }
        } else {
            console.error(message);
        }
    }
    static warning(message) {
        if(environment != 'production') {
            console.log(chalk.keyword('orange')(`[WARNING] ${message}`));
        } else {
            console.log(`[WARNING] ${message}`);
        }
    }
    static trace(message) {
        console.trace(message);
    }
}

// make the classes available to rest of the code

module.exports = {
    Logger: Logger,
    Debugger: Debugger
};