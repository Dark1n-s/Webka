import { Command } from "commander";
import fs from 'fs/promises';
import http from 'http';
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
    
    const server = http.createServer(async (req,res) =>
    {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Method not Allowed');
    });
    server.listen(options.port, options.host, ()=>
    {
        console.log('ss')
    });
}



startServer();