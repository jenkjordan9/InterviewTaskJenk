import express from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';

const app = express();
const port = 8080;

// Initialize WebSocket Server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Fetch and send data periodically
    const interval = setInterval(async () => {
        try {
            const responses = await Promise.all([
                axios.get('https://data--us-east.upscope.io/status?stats=1'),
                axios.get('https://data--eu-west.upscope.io/status?stats=1'),
                axios.get('https://data--eu-central.upscope.io/status?stats=1'),
                axios.get('https://data--us-west.upscope.io/status?stats=1'),
                axios.get('https://data--sa-east.upscope.io/status?stats=1'),
                axios.get('https://data--ap-southeast.upscope.io/status?stats=1'),
                // Add other endpoint requests here
            ]);

            ws.send(JSON.stringify({
                usEastData: responses[0].data,
                euWestData: responses[1].data,
                euCentralData: responses[2].data,
                usWestData: responses[3].data,
                saEastData: responses[4].data,
                apSouthEastData: responses[5].data,
                // Include data from other endpoints here
            }));
            console.log('Data sent to client');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 5000); // Fetch every 5 seconds

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

// Integrating WebSocket with Express
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
