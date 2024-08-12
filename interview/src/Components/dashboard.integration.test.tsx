import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Components/dashboard';
import { DashboardData } from '../Components/dashboard';
import { RegionData } from '../Components/dashboard';
import '@testing-library/jest-dom';

beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

// Mock data for the Dashboard component
const mockData: DashboardData = {
    usEastData: {
        status: "ok",
        region: "us-east",
        results: {
            services: {
                redis: true,
                database: true,
            },
            stats: {
                servers_count: 2,
                online: 1916,
                session: 3000,
                server: {
                    active_connections: 1478,
                    wait_time: 0.2,
                    workers: [
                        ["requests:pageviews", { wait_time: 0.1, workers: 5, waiting: 1, idle: 2, time_to_return: 5, recently_blocked_keys: [], top_keys: [] }],
                        ["io", { wait_time: 0.3, workers: 10, waiting: 3, idle: 4, time_to_return: 7, recently_blocked_keys: [], top_keys: [] }],
                    ],
                    cpu_load: 0.05,
                    timers: 100,
                }
            }
        }
    },
    euWestData: {
        status: "ok",
        region: "eu-west",
        results: {
            services: {
                redis: true,
                database: true,
            },
            stats: {
                servers_count: 2,
                online: 1916,
                session: 3000,
                server: {
                    active_connections: 1478,
                    wait_time: 0.2,
                    workers: [
                        ["requests:pageviews", { wait_time: 0.1, workers: 5, waiting: 1, idle: 2, time_to_return: 5, recently_blocked_keys: [], top_keys: [] }],
                        ["io", { wait_time: 0.3, workers: 10, waiting: 3, idle: 4, time_to_return: 7, recently_blocked_keys: [], top_keys: [] }],
                    ],
                    cpu_load: 0.05,
                    timers: 100,
                }
            }
        }
    },
    euCentralData: {
        status: "ok",
        region: "eu-central",
        results: {
            services: {
                redis: true,
                database: true,
            },
            stats: {
                servers_count: 2,
                online: 1916,
                session: 3000,
                server: {
                    active_connections: 1478,
                    wait_time: 0.2,
                    workers: [
                        ["requests:pageviews", { wait_time: 0.1, workers: 5, waiting: 1, idle: 2, time_to_return: 5, recently_blocked_keys: [], top_keys: [] }],
                        ["io", { wait_time: 0.3, workers: 10, waiting: 3, idle: 4, time_to_return: 7, recently_blocked_keys: [], top_keys: [] }],
                    ],
                    cpu_load: 0.05,
                    timers: 100,
                }
            }
        }
    },
    usWestData: {
        status: "ok",
        region: "us-west",
        results: {
            services: {
                redis: true,
                database: true,
            },
            stats: {
                servers_count: 2,
                online: 1916,
                session: 3000,
                server: {
                    active_connections: 1478,
                    wait_time: 0.2,
                    workers: [
                        ["requests:pageviews", { wait_time: 0.1, workers: 5, waiting: 1, idle: 2, time_to_return: 5, recently_blocked_keys: [], top_keys: [] }],
                        ["io", { wait_time: 0.3, workers: 10, waiting: 3, idle: 4, time_to_return: 7, recently_blocked_keys: [], top_keys: [] }],
                    ],
                    cpu_load: 0.05,
                    timers: 100,
                }
            }
        }
    },
    saEastData: {
        status: "ok",
        region: "sa-east",
        results: {
            services: {
                redis: true,
                database: true,
            },
            stats: {
                servers_count: 2,
                online: 1916,
                session: 3000,
                server: {
                    active_connections: 1478,
                    wait_time: 0.2,
                    workers: [
                        ["requests:pageviews", { wait_time: 0.1, workers: 5, waiting: 1, idle: 2, time_to_return: 5, recently_blocked_keys: [], top_keys: [] }],
                        ["io", { wait_time: 0.3, workers: 10, waiting: 3, idle: 4, time_to_return: 7, recently_blocked_keys: [], top_keys: [] }],
                    ],
                    cpu_load: 0.05,
                    timers: 100,
                }
            }
        }
    },
    apSouthEastData: {
        status: "ok",
        region: "ap-southeast",
        results: {
            services: {
                redis: true,
                database: true,
            },
            stats: {
                servers_count: 2,
                online: 1916,
                session: 3000,
                server: {
                    active_connections: 1478,
                    wait_time: 0.2,
                    workers: [
                        ["requests:pageviews", { wait_time: 0.1, workers: 5, waiting: 1, idle: 2, time_to_return: 5, recently_blocked_keys: [], top_keys: [] }],
                        ["io", { wait_time: 0.3, workers: 10, waiting: 3, idle: 4, time_to_return: 7, recently_blocked_keys: [], top_keys: [] }],
                    ],
                    cpu_load: 0.05,
                    timers: 100,
                }
            }
        }
    },
};

describe('Dashboard Component Integration', () => {
    test('renders RegionCard within Dashboard and displays region data', () => {
        render(<Dashboard data={mockData} />);
        
        // Check that the RegionCard for "us-east" is rendered within the Dashboard
        expect(screen.getByText(/us-east Region Overview/i)).toBeInTheDocument();
        
        // Check if specific data points are correctly displayed within the RegionCard
        expect(screen.getByText(/Status: ok/i)).toBeInTheDocument();
        expect(screen.getByText(/Active Connections: 1478/i)).toBeInTheDocument();
        expect(screen.getByText(/CPU Load: 0.05/i)).toBeInTheDocument();
        expect(screen.getByText(/Worker Utilization/i)).toBeInTheDocument();
        
        // You can add more assertions here to cover other regions or edge cases
    });

    test('handles empty data scenario gracefully', () => {
        const emptyRegionData: RegionData = {
            status: '',
            region: '',
            results: {
                services: {
                    redis: false,
                    database: false,
                },
                stats: {
                    servers_count: 0,
                    online: 0,
                    session: 0,
                    server: {
                        active_connections: 0,
                        wait_time: 0,
                        workers: [],
                        cpu_load: 0,
                        timers: 0,
                    },
                },
            },
        };
    
        const emptyData: DashboardData = {
            usEastData: emptyRegionData,
            euWestData: emptyRegionData,
            euCentralData: emptyRegionData,
            usWestData: emptyRegionData,
            saEastData: emptyRegionData,
            apSouthEastData: emptyRegionData,
        };
    
        render(<Dashboard data={emptyData} />);
    });
});
