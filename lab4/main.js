import {program} from 'commander';
import http from 'http';
import fs from 'fs';
import { start } from 'repl';

program
    .helpOption('-h,--help')
    .requiredOption('-i, --input <path>')
    .requiredOption('-h, --host <address>')
    .requiredOption('-p, --port <number>')
    .option('-o, --output <path>');

program.parse(process.argv)
const options = program.opts();

fs.access(options.input, fs.constants.F_OK, (err) =>
{
    if (err)
    {
        console.log('Cannot find input file')
        process.exit(444);
    }
    startServer();
}
);

function startServer()
{}
