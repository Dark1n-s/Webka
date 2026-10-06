import { Command } from "commander";
import fs from 'fs';

const program = new Command();

program
    .name('transport-json')
    .description('json файл з даними руху громадського транспорту у Львові')
    .version('1.0.0')
    .option('-f, --file <path>', 'шлях до json-файлу з даними', 'route.json');
function readData(filePath)
{
    try
    {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent)
    }
    catch(error)
    {
        if (error.code === 'ENOENT')
        {
            console.log(`Файл ${filePath} не знайдено.`);
        } 
        else if (error instanceof SyntaxError)
        {
            console.log(`Файл ${filePath} містить некоректний json`);
        }
        else
        {
            console.log(`Помилка читання файл`);
        }
        process.exit(1);
    }
}
program
    .command('list')
    .description('Стислий список маршрутів з можливістю обмеження кількості виведених данних')
    .option('-l, --limit <number>', 'обмежити кількість виведених маршрутів')
    .action
    ((options) => 
    {
        const globalOpts = program.opts();
        const data = readData(globalOpts.file);

        let routes = data.routes;

        if(options.limit)
        {
            const limit = Number(options.limit);
            if (isNaN(limit) || limit <=0)
            {
                console.log("Параметр ліміту повинен бути додатнім числом")
                process.exit(1);
            }
            routes = routes.slice(0, limit);
        }
        console.log('Список маршрутів:');
        routes.forEach(route => 
        {
            console.log(`- [${route.type}] Маршрут №${route.id}: ${route.route} `)    
        });
    }

)

program.parse(process.argv);


