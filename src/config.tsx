const config: {
  pollInterval: number,
  averageWindowSize: number,
  threshold: number,
  minutesOverThreshold: number,
  cpuUrl: string
} = {
  pollInterval: parseInt(process.env.POLL_INTERVAL || "2000"),
  averageWindowSize: parseInt(process.env.AVG_SIZE || "3"),
  threshold: parseFloat(process.env.THRESHOLD || ".18"),
  minutesOverThreshold: parseInt(process.env.MIN_THRESHOLD || "2"),
  cpuUrl: process.env.CPU_URL || "http://localhost:3001/cpu"
}

export default config;
