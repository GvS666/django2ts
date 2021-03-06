// TODO: clean this up

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(process.argv[2])
});

const classRegex = /class\s*(\w+)\(models.Model/g;
const fieldRegex = /\s*(\w+)\s*=\s*models\.(.*)Field/g;
const notFound = 'not_found';

const mapping = {
    'AutoField': 'number',
    'Boolean' : 'boolean',
    'Char' : 'string',
    'URL' : 'string',
    'Text' : 'string',
    'Decimal' : 'number',
    'Integer' : 'number',
    'OneToOne' : 'number',
    'ManyToMany' : 'number[]',
    'PositiveInteger' : 'number',
};

let models = {};

let currentModel = notFound;
models[currentModel] = [];

lineReader.on('line', (line) => {
    let classFinder = classRegex.exec(line);
    if (classFinder) {
            currentModel = classFinder[1];
            models[currentModel] = [];
    } else {
        let fieldFinder = fieldRegex.exec(line);
        if (fieldFinder) {
            models[currentModel].push([fieldFinder[1], fieldFinder[2]]);
        }
    }
});

lineReader.on('close', () => {
    if (models[notFound].length === 0 ) {
        delete models[notFound];
    }
    for (let model in models) {
        console.log('export class %s {', model);
        for (let field of models[model]) {
            if (field[1] in mapping) {
                console.log('\t%s: %s;', field[0], mapping[field[1]]);
            } else {
                console.log('\t%s: %s;', field[0], field[1]);
            }
        }
        console.log('}\n');
    }
});
