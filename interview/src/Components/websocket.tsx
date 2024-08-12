import React, { useEffect, useState } from 'react';

const WebSocketComponent: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
    
        socket.onopen = () => {
            console.log('WebSocket connection established');
        };
    
        socket.onmessage = (event) => {
            console.log('Data received:', event.data);
            const receivedData = JSON.parse(event.data);
            setData(receivedData);
        };
    
        socket.onclose = () => {
            console.log('WebSocket closed');
        };
    
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>DevOps Dashboard</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default WebSocketComponent;
