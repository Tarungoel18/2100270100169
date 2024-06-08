import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
const token = process.env.TOKEN;

if (!token) {
    console.error('Error: TOKEN environment variable is not set.');
    process.exit(1);
}

let numbers = [];

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;

    // Validate the type
    if (!['p', 'f', 'e', 'r'].includes(type)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    // Determine the correct API endpoint based on the type
    const apiUrlMap = {
        p: 'primes',
        f: 'fibonacci',
        e: 'even',
        r: 'random'
    };
    const apiUrl = `http://20.244.56.144/test/${apiUrlMap[type]}`;

    // Fetch number from third-party API
    let newNumber;
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `${token}`,
            },
            timeout: TIMEOUT_MS,
        });
        if (!response.data || typeof response.data.number !== 'number') {
            throw new Error('Invalid response format');
        }
        newNumber = response.data.number;
    } catch (error) {
        console.error('Error fetching number:', error.message);
        return res.status(500).json({ error: 'Error fetching number' });
    }

    // Add the number if it's unique and update the window
    const windowPrevState = [...numbers];
    if (!numbers.includes(newNumber)) {
        if (numbers.length >= WINDOW_SIZE) {
            numbers.shift(); // Remove the oldest number if at window size
        }
        numbers.push(newNumber);
    }

    // Calculate the average
    const average = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;

    // Prepare the response
    const responsePayload = {
        windowPrevState,
        windowCurrState: [...numbers],
        numbers: [...numbers],
        avg: average.toFixed(2),
    };

    res.json(responsePayload);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
