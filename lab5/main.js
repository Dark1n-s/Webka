import { Command } from "commander";

const program = new Command();

program
    .requiredOption('-h, --host <address>', 'Адреса сервера')
    .requiredOption('-p, --port <number>', 'Порт сервера')
    .requiredOption('-c, --cache <path>', 'Шлях до теки кешу')

program.parse(process.argv);
const options = program.opts();
console.log(options);