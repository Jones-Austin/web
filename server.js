const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let dbData = [];
let nextId = 1;

app.get('/api/data', (req, res) => {
    console.log('GET /api/data requested');
    res.json(dbData);
});

app.post('/api/data', (req, res) => {
    console.log('POST /api/data received:', req.body);
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).json({ message: 'Key and value are required' });
    }

    const newItem = {
        id: nextId++,
        key: key.trim(),
        value: value.trim()
    };
    dbData.push(newItem);
    console.log('Data added:', newItem);
    console.log('Current DB:', dbData);
    res.status(201).json({ message: 'Record has been saved.', data: newItem });
});

app.get('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`GET /api/data/${id} requested`);
    const item = dbData.find(i => i.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Record not found' });
    }
});

app.put('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`PUT /api/data/${id} received:`, req.body);
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).json({ message: 'Key and value are required for update' });
    }

    const itemIndex = dbData.findIndex(i => i.id === id);

    if (itemIndex !== -1) {
        dbData[itemIndex] = { ...dbData[itemIndex], key: key.trim(), value: value.trim() };
        console.log('Data updated:', dbData[itemIndex]);
        console.log('Current DB:', dbData);
        res.json({ message: 'Record updated successfully.', data: dbData[itemIndex] });
    } else {
        console.log(`Record with id ${id} not found for update.`);
        res.status(404).json({ message: 'Record not found' });
    }
});

app.delete('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`DELETE /api/data/${id} requested`);
    const itemIndex = dbData.findIndex(i => i.id === id);

    if (itemIndex !== -1) {
        const deletedItem = dbData.splice(itemIndex, 1);
        console.log('Data deleted:', deletedItem);
        console.log('Current DB:', dbData);
        res.json({ message: 'Record deleted successfully.', data: deletedItem[0] });
    } else {
        console.log(`Record with id ${id} not found for deletion.`);
        res.status(404).json({ message: 'Record not found' });
    }
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});