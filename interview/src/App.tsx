import React, { useEffect, useState } from 'react';
import Dashboard from './Components/dashboard';
import { DashboardData } from './Components/dashboard';
import './App.css';

const App: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            setData(receivedData);
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Dashboard data={data} />
        </div>
    );
};

export default App;
