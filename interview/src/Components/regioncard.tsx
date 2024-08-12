import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Avatar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { RegionData } from './dashboard';

interface RegionCardProps {
    title: string;
    data: RegionData;
}

const RegionCard: React.FC<RegionCardProps> = ({ title, data }) => {
    const [activeConnectionsData, setActiveConnectionsData] = useState<{ time: string, active_connections: number }[]>([]);
    const [cpuLoadData, setCpuLoadData] = useState<{ time: string, cpu_load: number }[]>([]);
    const [workerStatesData, setWorkerStatesData] = useState<any[]>([]);

    useEffect(() => {
        const updateTimeSeriesData = () => {
            const currentTime = new Date().toLocaleTimeString();

            setActiveConnectionsData(prevData => [
                ...prevData.slice(-9),
                { time: currentTime, active_connections: data.results.stats.server.active_connections }
            ]);

            setCpuLoadData(prevData => [
                ...prevData.slice(-9),
                { time: currentTime, cpu_load: data.results.stats.server.cpu_load }
            ]);

            const updatedWorkerStates = data.results.stats.server.workers.map(([workerName, stats]) => ({
                worker: workerName,
                active: stats.workers,
                idle: stats.idle,
                waiting: stats.waiting,
            }));
            setWorkerStatesData(updatedWorkerStates);
        };

        updateTimeSeriesData();
    }, [data]);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>{title} Region Overview</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography>Status: {data.status}</Typography>
                    <Typography>
                        Redis: {data.results.services.redis ? <CheckCircleOutlineIcon color="success" /> : <ErrorOutlineIcon color="error" />}
                    </Typography>
                    <Typography>
                        Database: {data.results.services.database ? <CheckCircleOutlineIcon color="success" /> : <ErrorOutlineIcon color="error" />}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography>Servers Count: {data.results.stats.servers_count}</Typography>
                    <Typography>Online Users/Sessions: {data.results.stats.online}</Typography>
                    <Typography>Active Connections: {data.results.stats.server.active_connections}</Typography>
                    <Typography>CPU Load: {data.results.stats.server.cpu_load}</Typography>
                    <Typography>Timers: {data.results.stats.server.timers}</Typography>
                </Grid>
            </Grid>

            {/* Four Quadrants for Metrics */}
            <Grid container spacing={2} sx={{ marginTop: 4 }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>Active Connections Over Time</Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={activeConnectionsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="active_connections" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>CPU Load Over Time</Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={cpuLoadData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="cpu_load" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>Worker Utilization</Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={workerStatesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="worker" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="active" stackId="a" fill="#8884d8" />
                                <Bar dataKey="idle" stackId="a" fill="#82ca9d" />
                                <Bar dataKey="waiting" stackId="a" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ height: '100%', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>Worker Statistics</Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableBody>
                                    {data.results.stats.server.workers.map(([workerName, stats], index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Avatar>{workerName[0]}</Avatar> {workerName}
                                            </TableCell>
                                            <TableCell>Workers: {stats.workers}</TableCell>
                                            <TableCell>Waiting: {stats.waiting}</TableCell>
                                            <TableCell>Idle: {stats.idle}</TableCell>
                                            <TableCell>Wait Time: {stats.wait_time}ms</TableCell>
                                            <TableCell>Blocked Keys: {stats.recently_blocked_keys.length}</TableCell>
                                            <TableCell>Top Keys: {stats.top_keys.length}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegionCard;
