import si from 'systeminformation';
import { SystemMetrics } from '../../types/system-metrics';
import { RegistryCommand, RegistryOperationResult } from '../../types/registry-commands';

export class SystemMonitor {
  private cpuHistory: number[] = new Array(50).fill(0);
  private memHistory: number[] = new Array(50).fill(0);
  private metricsRefreshInterval: number;

  constructor(refreshInterval: number = 5000) {
    this.metricsRefreshInterval = refreshInterval;
  }

  public async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const [cpuStatic, cpuLoad, mem, disks, temp] = await Promise.all([
        si.cpu(),
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.cpuTemperature()
      ]);

      return {
        cpu: {
          currentLoad: cpuLoad.currentLoad,
          temperature: temp.main,
          cores: cpuStatic.cores,
          physicalCores: cpuStatic.physicalCores,
          processors: cpuStatic.processors
        },
        memory: {
          total: mem.total,
          free: mem.free,
          used: mem.used,
          active: mem.active,
          available: mem.available,
          buffers: mem.buffers,
          cached: mem.cached
        },
        disks: disks.map(disk => ({
          fs: disk.fs,
          type: disk.type,
          size: disk.size,
          used: disk.used,
          available: disk.available,
          use: disk.use,
          mount: disk.mount
        })),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      throw error;
    }
  }

  public async executeRegistryCommand(
    command: RegistryCommand
  ): Promise<RegistryOperationResult> {
    // TODO: Implement registry command execution
    return {
      success: false,
      output: '',
      error: 'Not implemented',
      timestamp: new Date()
    };
  }

  public startMonitoring(callback: (metrics: SystemMetrics) => void): NodeJS.Timeout {
    return setInterval(async () => {
      try {
        const metrics = await this.getSystemMetrics();
        callback(metrics);
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, this.metricsRefreshInterval);
  }
}
