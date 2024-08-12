import React from 'react';
import { Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Avatar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { RegionData } from './dashboard';

interface RegionCardProps {
    title: string;
    data: RegionData;
}

const RegionCard: React.FC<RegionCardProps> = ({ title, data }) => {
    return (
        <Box>
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
            <Box sx={{ marginTop: 4 }}>
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
        </Box>
    );
};

export default RegionCard;
