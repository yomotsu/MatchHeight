export default function throttle<T extends (...args: any[]) => void>(fn: T, threshold: number): (...args: Parameters<T>) => void;
