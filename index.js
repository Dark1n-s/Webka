import { Command } from "commander";
import fs from 'fs';

const program = new Command();

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



/*--------------------------------------------------------------File------------------------------------------------------*/






program
    .name('transport-json')
    .description('json файл з даними руху громадського транспорту у Львові')
    .version('1.0.0')
    .option('-f, --file <path>', 'шлях до json-файлу з даними', 'route.json');






/*--------------------------------------------------------------List------------------------------------------------------*/






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








/*--------------------------------------------------------------One Route------------------------------------------------------*/




program
    .command('show <id>')
    .description('Показ усіх даних про маршрут за його ID')
    .action((id) =>
    {
        const globalOpts = program.opts();
        const data = readData(globalOpts.file);

        const routeId = Number(id);
        if(isNaN(routeId))
        {
            console.log('ID повинно бути числом');
            process.exit(1);
        }

        const route = data.routes.find(r => r.id === routeId);
        
        if(!route)
        {
            console.log(`Маршруту з ID ${routeId} не знайдено.`);
            process.exit(1);
        }
        console.log(route);
    }

)



/*--------------------------------------------------------------One Field------------------------------------------------------*/


program
    .command('field <id> <path>')
    .description('Показати значення окремого поля маршруту')
    .action((id, path) =>
    {
        const globalOpts = program.opts();
        const data = readData(globalOpts.file);
        const routeId = Number(id);
        const route = data.routes.find(r => r.id==routeId);
        if(!route)
        {
            console.log(`Маршруту з ID ${routeId} не знайдено.`)
            process.exit(1);
        }

        const keys = path.split('.');
        let result = route;

        for (const i of keys)
        {
            if (result === undefined || result === null)
            {
                break;
            }
            result = result[i];
        }


        if (result === undefined)
        {
            console.log(`Поле ${path} відсутнє.`)
        }
        else if (result === null)
        {
            console.log(`Поле ${path} існує, але має значення null`)
        }
        else
        {
            console.log(result);
        }
    } 
)


/*--------------------------------------------------------------One Field------------------------------------------------------*/


program
    .command('stops <id>')
    .description('Показати зупинки траспорту за його ID')
    .option('-c, --coords', 'Показати координати зупинки')
    .action((id, options) =>
    {
        const globalOpts = program.opts();
        const data = readData(globalOpts.file);
        const routeId = Number(id);

        if(isNaN(routeId))
        {
            console.log('ID повинно бути числом')
            process.exit(1);
        }
        const route = data.routes.find(r => r.id==routeId);
        if(!route)
        {
            console.log(`Маршруту з ID ${routeId} не знайдено`);
            process.exit(1);
        }
        if(!route.stops || route.stops.length === 0)
        {
            console.log(`Маршрут з ID ${routeId} ще немає зупинок`)
            process.exit(1);
        }
        console.log(`Зупинки маршруту №${routeId}:`)
        route.stops.forEach(stop =>
        {
            if (options.coords)
            {
                console.log(`- ${stop.name} [Lat: ${stop.coordinates.lat}, Lng: ${stop.coordinates.lng}]`);
            }
            else
            {
                console.log(`- ${stop.name}`);
            }
        }

        )

    }
)


program.parse(process.argv);


