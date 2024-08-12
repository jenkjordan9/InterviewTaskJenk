import React from 'react';
import { render, screen } from '@testing-library/react';
import { RegionData } from './dashboard';
import RegionCard from './regioncard';
import '@testing-library/jest-dom';


beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

const mockData: RegionData = {
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
            session: 1,
            server: {
                active_connections: 1478,
                wait_time: 88,
                workers: [
                    ["requests:pageviews", { wait_time: 0, workers: 0, waiting: 0, idle: 0, time_to_return: 0, recently_blocked_keys: [], top_keys: [] }],
                    ["io", { wait_time: 88, workers: 822, waiting: 2, idle: 82, time_to_return: 0, recently_blocked_keys: [["key1", 1]], top_keys: [["key1", 5]] }],
                    ["requests:unsupported-users", { wait_time: 0, workers: 0, waiting: 0, idle: 0, time_to_return: 0, recently_blocked_keys: [], top_keys: [] }],
                    ["recording-workers", { wait_time: 0, workers: 2, waiting: 0, idle: 2, time_to_return: 0, recently_blocked_keys: [], top_keys: [] }],
                ],
                cpu_load: 0.05,
                timers: 100,
            },
        },
    },
};

describe('RegionCard Component', () => {
    test('renders region overview', () => {
        render(<RegionCard title="us-east" data={mockData} />);
        
        // Expecting a specific region overview text
        expect(screen.getByText(/us-east Region Overview/i)).toBeInTheDocument();

        // Expecting status text
        expect(screen.getByText(/Status: ok/i)).toBeInTheDocument();

        // Active Connections - get the specific paragraph
        const activeConnectionsElements = screen.getAllByText(/Active Connections/i);
        expect(activeConnectionsElements[0]).toBeInTheDocument();

        // CPU Load - targeting the paragraph element containing CPU load value
        const cpuLoadParagraph = screen.getByText(/CPU Load:/i).closest('p');
        expect(cpuLoadParagraph).toBeInTheDocument();

        // Worker Utilization
        expect(screen.getByText(/Worker Utilization/i)).toBeInTheDocument();
    });

    test('renders worker statistics table', () => {
        render(<RegionCard title="us-east" data={mockData} />);

        // requests:pageviews
        expect(screen.getByText(/requests:pageviews/i)).toBeInTheDocument();

        // io - get the specific cell or avatar, depending on your component structure
        const ioElements = screen.getAllByText(/io/i);
        expect(ioElements[0]).toBeInTheDocument();

        // recording-workers
        expect(screen.getByText(/recording-workers/i)).toBeInTheDocument();
    });
});

