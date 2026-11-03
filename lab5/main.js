import { Command } from "commander";
import fs from 'fs/promises';
import { start } from "repl";
const program = new Command();

program
    .requiredOption('-h, --host <address>', 'Адреса сервера')
    .requiredOption('-p, --port <number>', 'Порт сервера')
    .requiredOption('-c, --cache <path>', 'Шлях до теки кешу')

program.parse(process.argv);
const options = program.opts();

async function startServer()
{
    await fs.mkdir(options.cache, {recursive: true})
    console.log("ss")
}

startServer();