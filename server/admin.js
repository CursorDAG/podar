const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const ownersFilePath = path.join(__dirname, '../public/owners.json'); // Убедитесь, что файл находится в этой директории

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
    const newOwner = req.body;

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

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
