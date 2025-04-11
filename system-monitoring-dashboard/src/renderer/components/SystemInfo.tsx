import React, { useEffect, useState } from 'react';
import { getCpuUsage, getGpuUsage, getRamUsage, getDiskUsage } from '../../utils/systemInfo';

const SystemInfo: React.FC = () => {
    const [cpuUsage, setCpuUsage] = useState<number>(0);
    const [gpuUsage, setGpuUsage] = useState<number>(0);
    const [ramUsage, setRamUsage] = useState<number>(0);
    const [diskUsage, setDiskUsage] = useState<number>(0);

    useEffect(() => {
        const fetchSystemInfo = async () => {
            const cpu = await getCpuUsage();
            const gpu = await getGpuUsage();
            const ram = await getRamUsage();
            const disk = await getDiskUsage();

            setCpuUsage(cpu);
            setGpuUsage(gpu);
            setRamUsage(ram);
            setDiskUsage(disk);
        };

        const interval = setInterval(fetchSystemInfo, 1000);
        fetchSystemInfo(); // Initial fetch

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="system-info">
            <h2>System Information</h2>
            <ul>
                <li>CPU Usage: {cpuUsage}%</li>
                <li>GPU Usage: {gpuUsage}%</li>
                <li>RAM Usage: {ramUsage.toFixed(2)}%</li>
                <li>Disk Usage: {diskUsage}%</li>
            </ul>
        </div>
    );
};

export default SystemInfo;