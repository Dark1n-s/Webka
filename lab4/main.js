import {program} from 'commander';
import http from 'http';
import fs from 'fs';

program
    .helpOption('-h,--help')
    .requiredOption('-i, --input <path>')
    .requiredOption('-h, --host <address>')
    .requiredOption('-p, --port <number>')
    .option('-o, --output <path>');

    program.parse(process.argv)
    const options = program.opts();