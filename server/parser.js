const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express()
const port = 3001

const ownersFilePath = path.join(__dirname, '../public/owners.json')
const batchSize = 10

function writeDataInBatches(data) {
    let index = 0

    function writeBatch() {
        const batch = data.slice(index, index + batchSize)
        if (batch.length === 0) {
            console.log('Все данные записаны.')
            return
        }

        fs.readFile(ownersFilePath, 'utf8', (err, fileData) => {
            if (err) {
                console.error('Ошибка чтения файла:', err)
                return
            }

            const owners = JSON.parse(fileData)
            owners.push(...batch)

            fs.writeFile(
                ownersFilePath,
                JSON.stringify(owners, null, 2),
                'utf8',
                (err) => {
                    if (err) {
                        console.error('Ошибка записи файла:', err)
                        return
                    }

                    console.log(`Записано ${batch.length} записей.`)
                    index += batchSize
                    writeBatch()
                }
            )
        })
    }

    writeBatch()
}

// Функция для парсинга владельцев
async function fetchOwners(startId, endId) {
    let owners = []

    for (let id = startId; id <= endId; id++) {
        const url = `https://t.me/nft/SwissWatch-${id}`
        try {
            const response = await axios.get(url)
            const $ = cheerio.load(response.data)

            // Ищем ссылку и имя владельца
            let ownerLink = $('td > a').attr('href')
            let ownerName = $('td > a > span').text().trim()

            // Если ссылки нет, ищем просто имя в <span>
            if (!ownerLink) {
                ownerName = $('td > span').text().trim()
                ownerLink = '' // Пустая строка вместо "Нет доступа"
            }

            console.log(
                `Gift ID ${id}: ${ownerName} ${
                    ownerLink ? '(' + ownerLink + ')' : ''
                }`
            )
            owners.push({ id, name: ownerName, link: ownerLink })

            if (owners.length >= batchSize) {
                writeDataInBatches(owners)
                owners = []
            }
        } catch (error) {
            console.error(
                `Ошибка доступа к Gift ID ${id}: ${
                    error.response?.status || error.message
                }`
            )
        }
    }

    if (owners.length > 0) {
        writeDataInBatches(owners)
    }
}

// Задаем диапазон номеров подарков
fetchOwners(1, 500)

// Обслуживание статических файлов
app.use(express.static('public'))

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})
