import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvFile = new URL('./csv-file.csv', import.meta.url)

const stream = fs.createReadStream(csvFile)

const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2,
})

async function importFile() {
    const parseLines = stream.pipe(csvParse)

    for await (const line of parseLines) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        })
    }
};

importFile()