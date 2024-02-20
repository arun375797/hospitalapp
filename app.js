const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT =3000;
const filePath = path.join(__dirname, 'hospitalData.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Function to read hospital data from JSON file
function readData() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

// Function to write hospital data to JSON file
function writeData(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Data written successfully.');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

// Get all hospitals
app.get('/hospitals', (req, res) => {
    const hospitals = readData();
    res.json(hospitals);
});

// Get a hospital by name
app.get('/hospitals/:name', (req, res) => {
    const hospitals = readData();
    const hospital = hospitals.find(h => h.name === req.params.name);
    if (!hospital) {
        res.status(404).send('Hospital not found');
    } else {
        res.json(hospital);
    }
});

// Add a new hospital
app.post('/hospitals', (req, res) => {
    const hospitals = readData();
    const newHospital = req.body;
    hospitals.push(newHospital);
    writeData(hospitals);
    res.status(201).json(newHospital);
});

// Update a hospital
app.put('/hospitals/:name', (req, res) => {
    const hospitals = readData();
    const index = hospitals.findIndex(h => h.name === req.params.name);
    if (index === -1) {
        res.status(404).send('Hospital not found');
    } else {
        hospitals[index] = req.body;
        writeData(hospitals);
        res.json(hospitals[index]);
    }
});

// Delete a hospital
app.delete('/hospitals/:name', (req, res) => {
    const hospitals = readData();
    const index = hospitals.findIndex(h => h.name === req.params.name);
    if (index === -1) {
        res.status(404).send('Hospital not found');
    } else {
        const deletedHospital = hospitals.splice(index, 1)[0];
        writeData(hospitals);
        res.json(deletedHospital);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
