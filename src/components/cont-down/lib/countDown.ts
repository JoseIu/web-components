type TimeInpput = Date | number;

export interface TimeParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}
interface Options {
  onTick?: (time: TimeParts) => void;
  onComplete?: () => void;
  endTime?: TimeInpput;
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const validateDate = (date: unknown): boolean => {
  if (date instanceof Date || typeof date === 'number') return true;

  throw new Error(`The value ${JSON.stringify(date)} is not a valid time or date.`);
};

export const countDown = (startTime: TimeInpput, opts?: Options) => {
  validateDate(startTime);

  if (opts.endTime) {
    validateDate(opts.endTime);
  }
  let intervalId: globalThis.NodeJS.Timeout | null = null;

  const start = () => {
    const offset = opts?.endTime ? new Date(startTime).getTime() - new Date(opts.endTime).getTime() : 0;

    const timeStamp = new Date(startTime).getTime() - offset;
  };
};
