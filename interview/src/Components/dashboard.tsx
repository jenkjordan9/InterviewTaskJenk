import React, { useState } from 'react';
import { Box, IconButton, Typography, Card, CardContent } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import RegionCard from './regioncard';

export interface WorkerStats {
    wait_time: number;
    workers: number;
    waiting: number;
    idle: number;
    time_to_return: number;
    recently_blocked_keys: Array<any>;
    top_keys: Array<any>;
}

export interface RegionData {
    status: string;
    region: string;
    results: {
        services: {
            redis: boolean;
            database: boolean;
        };
        stats: {
            servers_count: number;
            online: number;
            session: number;
            server: {
                active_connections: number;
                wait_time: number;
                workers: [string, WorkerStats][];
                cpu_load: number;
                timers: number;
            };
        };
    };
}

export interface DashboardData {
    usEastData: RegionData;
    euWestData: RegionData;
    euCentralData: RegionData;
    usWestData: RegionData;
    saEastData: RegionData;
    apSouthEastData: RegionData;
}

const regions = ['usEastData', 'euWestData', 'euCentralData', 'usWestData', 'saEastData', 'apSouthEastData'];

const Dashboard: React.FC<{ data: DashboardData }> = ({ data }) => {
    const [currentRegionIndex, setCurrentRegionIndex] = useState(0);

    const currentRegionKey = regions[currentRegionIndex];
    const currentRegionData = data[currentRegionKey as keyof DashboardData];

    const handlePrev = () => {
        setCurrentRegionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : regions.length - 1));
    };

    const handleNext = () => {
        setCurrentRegionIndex((prevIndex) => (prevIndex < regions.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 1, backgroundColor: '#f4f6f8' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <IconButton onClick={handlePrev}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" sx={{ margin: '0 20px', fontWeight: 'bold' }}>
                    {currentRegionData.region}
                </Typography>
                <IconButton onClick={handleNext}>
                    <ArrowForward />
                </IconButton>
            </Box>
            <Card sx={{ width: '100%'}}>
                <CardContent>
                    <RegionCard title={currentRegionData.region} data={currentRegionData} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard;
