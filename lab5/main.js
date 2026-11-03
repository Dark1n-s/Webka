import { Command } from "commander";
import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import superagent from 'superagent';

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
        try
        {
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
                    if(err.code === 'ENOENT')
                    {
                        try
                        {
                            const response = await superagent.get(`https://http.cat/${code}`)
                            await fs.writeFile(filePath, response.body);
                            res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Source': 'http.cat' });
                            res.end(response.body);
                        }
                        catch(supererr)
                        {
                            if (supererr.status === 404)
                            {
                                res.writeHead(404, {'Content-Type': 'text/plain' });
                                res.end('Not Found on http.cat');
                            }
                        }

                    }
                }
            }
            else if(req.method === 'PUT')
            {
                const chunks = [];

                for await (const chunk of req)
                {
                    chunks.push(chunk);
                }

                const body = Buffer.concat(chunks);

                await fs.writeFile(filePath, body);

                res.writeHead(201, { 'Content-Type': 'text/plain' });
                res.end('Created');
            }
            else if(req.method === 'DELETE')
            {
                try
                {
                    await fs.unlink(filePath);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('OK');
                }
                catch(err)
                {
                    if(err.code === 'ENOENT')
                    {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('Not Found');
                    }
                    else
                    {
                        throw err;
                    }
                }
            }
            else
            {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.end('Method Not Allowed');
            }
        }
        catch(globalErr)
        {
            console.log(globalErr);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
        
        
    });




    server.listen(options.port, options.host, ()=>
    {
        console.log('ss')
    });
}



startServer();