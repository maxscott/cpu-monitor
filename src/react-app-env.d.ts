/// <reference types="react-scripts" />
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POLL_INTERVAL: string;
      AVG_SIZE: string;
      THRESHOLD: string;
      MIN_THRESHOLD: string;
      CPU_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// // convert it into a module by adding an empty export statement.
export {}
