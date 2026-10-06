import { Command } from "commander";
import fs from 'fs';

const program = new Command();

program
    .name('transport-json')
    .description('json файл з даними руху громадського транспорту у Львові')
    .version('1.0.0');

program.parse(process.argv)