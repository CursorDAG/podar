const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

const ownersFilePath = path.join(__dirname, '../public/owners.json');
const batchSize = 10;

const startId = parseInt(process.argv[2], 10);
const endId = parseInt(process.argv[3], 10);

function writeDataInBatches(data) {
    let index = 0;

    function writeBatch() {
        const batch = data.slice(index, index + batchSize);
        if (batch.length === 0) {
            console.log('Все данные записаны.');
            return;
        }

        fs.readFile(ownersFilePath, 'utf8', (err, fileData) => {
            if (err) {
                console.error('Ошибка чтения файла:', err);
                return;
            }

            const owners = JSON.parse(fileData);
            const existingIds = new Set(owners.map(owner => owner.id));

            const newBatch = batch.filter(owner => !existingIds.has(owner.id));
            owners.push(...newBatch);

            fs.writeFile(ownersFilePath, JSON.stringify(owners, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Ошибка записи файла:', err);
                    return;
                }

                console.log(`Записано ${newBatch.length} записей.`);
                index += batchSize;
                writeBatch();
            });
        });
    }

    writeBatch();
}

async function fetchOwners(startId, endId) {
    let owners = [];

    for (let id = startId; id <= endId; id++) {
        const url = `https://t.me/nft/SwissWatch-${id}`;
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            let ownerLink = $('td > a').attr('href');
            let ownerName = $('td > a > span').text().trim();

            if (!ownerLink) {
                ownerName = $('td > span').text().trim();
                ownerLink = '';
            }

            console.log(`Gift ID ${id}: ${ownerName} ${ownerLink ? '(' + ownerLink + ')' : ''}`);
            owners.push({ id, name: ownerName, link: ownerLink });

            if (owners.length >= batchSize) {
                writeDataInBatches(owners);
                owners = [];
            }
        } catch (error) {
            console.error(`Ошибка доступа к Gift ID ${id}: ${error.response?.status || error.message}`);
        }
    }

    if (owners.length > 0) {
        writeDataInBatches(owners);
    }
}

fetchOwners(startId, endId);

// Обслуживание статических файлов
app.use(express.static('public'));

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
