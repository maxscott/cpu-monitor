const config: {
  pollInterval: number,
  averageWindowSize: number,
  threshold: number,
  minutesOverThreshold: number,
  cpuUrl: string
} = {
  pollInterval: parseInt(process.env.POLL_INTERVAL),
  averageWindowSize: parseInt(process.env.AVG_SIZE),
  threshold: parseFloat(process.env.THRESHOLD),
  minutesOverThreshold: parseInt(process.env.MIN_THRESHOLD),
  cpuUrl: process.env.CPU_URL
}

export default config;
