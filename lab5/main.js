import { Command } from "commander";
import fs from 'fs/promises';
import http from 'http';
import path from 'path';
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
        const code = req.url.slice(1);
        const filePath = path.join(options.cache, `${code}.jpg`)

        if(req.method === 'GET')
        {
            try
            {
                const image = await fs.readFile(filePath)
                res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Source': 'cache' });
                res.end(image);
            }
            catch(err)
            {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found in cache');
            }
        }
        else
        {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
        }
    });




    server.listen(options.port, options.host, ()=>
    {
        console.log('ss')
    });
}



startServer();