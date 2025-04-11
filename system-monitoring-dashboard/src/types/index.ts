export interface SystemInfo {
    cpuUsage: number;
    gpuUsage: number;
    ramUsage: number;
    diskUsage: number;
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
}