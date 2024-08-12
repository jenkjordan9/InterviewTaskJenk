import express from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 8080;

// Initialize WebSocket Server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Fetch and send data periodically with error handling
    const interval = setInterval(async () => {
        try {
            const source = axios.CancelToken.source();
            const timeout = setTimeout(() => {
                source.cancel();
            }, 5000); // 5 seconds timeout

            const responses = await Promise.all([
                axios.get('https://data--us-east.upscope.io/status?stats=1', { cancelToken: source.token }),
                axios.get('https://data--eu-west.upscope.io/status?stats=1', { cancelToken: source.token }),
                axios.get('https://data--eu-central.upscope.io/status?stats=1', { cancelToken: source.token }),
                axios.get('https://data--us-west.upscope.io/status?stats=1', { cancelToken: source.token }),
                axios.get('https://data--sa-east.upscope.io/status?stats=1', { cancelToken: source.token }),
                axios.get('https://data--ap-southeast.upscope.io/status?stats=1', { cancelToken: source.token }),
            ]);

            clearTimeout(timeout);

            const data = {
                usEastData: responses[0].data || null,
                euWestData: responses[1].data || null,
                euCentralData: responses[2].data || null,
                usWestData: responses[3].data || null,
                saEastData: responses[4].data || null,
                apSouthEastData: responses[5].data || null,
            };

            ws.send(JSON.stringify(data));
            console.log('Data sent to client');
        } catch (error) {
            if (axios.isCancel(error)) {
                console.error('Request timed out:', error.message);
                ws.send(JSON.stringify({ error: 'Request timed out' }));
            } else {
                console.error('Error fetching data:', (error as Error).message);
                ws.send(JSON.stringify({ error: 'Failed to fetch data' }));
            }
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

// Rate limiting middleware to prevent overloading
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
