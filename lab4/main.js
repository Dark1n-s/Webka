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
{
    const server = http.createServer((req,res)=>
    {
        const baseURL = `http://${req.headers.host}`;
        const reqUrl = new URL(req.url, baseURL);

        if (reqUrl.pathname !== '/')
        {
            res.writeHead(404, {'content-type':'text/plain; charset=utf-8'});
            res.end('Шлях не знайдено');
            return;
        }

        const rated = reqUrl.searchParams.get('rated') === 'true';
        const minTurnsStr = reqUrl.searchParams.get('min_turns');
        let minTurns = 0;

        if(minTurnsStr !== null)
        {
            minTurns = Number(minTurnsStr);
            if(isNaN(minTurns))
            {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Параметр min_turns має бути числом');
                return;
            }
        }
        fs.readFile(options.input, 'utf-8', (readErr, data) =>
        {
            if (readErr)
            {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Помилка читання файлу');
                return;
            }

            let json;
            try
            {
                json = JSON.parse(data);
            }
            catch(parseErr)
            {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Пошкоджений файл даних');
                return;
            }
            

            const filtered = json.filter(item =>
            {
                if (rated && item.rated !== "TRUE")
                {
                    return false;
                }
                if (minTurns !== null && Number(item.turns)<= minTurns)
                {
                    return false;
                }
                return true;
            }
            ).map(item =>
            {
                return{
                    id: item.id || null,
                    winner: item.winner || null,
                    turns: item.turns ? Number(item.turns) : null,
                    opening: item.opening_name || null
                };
            }
            );

            const responseText = JSON.stringify(filtered, null, 2);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(responseText);


        });


    });
    server.listen(options.port, options.host);
}
