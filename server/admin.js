const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;
const ownersFilePath = path.join(__dirname, '../public/owners.json');

app.use(cors());
app.use(express.json());

app.get('/api/owners', (req, res) => {
    fs.readFile(ownersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/owners', (req, res) => {
    const newOwner = { id: uuidv4(), ...req.body };

    fs.readFile(ownersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        const owners = JSON.parse(data);
        owners.push(newOwner);

        fs.writeFile(ownersFilePath, JSON.stringify(owners, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Ошибка записи файла:', err);
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }

            res.status(201).json(newOwner);
        });
    });
});

app.post('/api/parse', (req, res) => {
    const { startId, endId } = req.body;
    const command = `node ${path.join(__dirname, 'parser.js')} ${startId} ${endId}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка выполнения команды: ${error.message}`);
            return res.status(500).json({ error: 'Ошибка выполнения команды' });
        }
        if (stderr) {
            console.error(`Ошибка: ${stderr}`);
            return res.status(500).json({ error: 'Ошибка выполнения команды' });
        }
        console.log(`Результат: ${stdout}`);
        res.status(200).json({ message: 'Парсинг запущен' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
