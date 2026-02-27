import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

interface ErrorEvents {
  'permission-error': (error: FirestorePermissionError) => void;
}

declare interface ErrorEmitter {
  on<U extends keyof ErrorEvents>(event: U, listener: ErrorEvents[U]): this;
  emit<U extends keyof ErrorEvents>(event: U, ...args: Parameters<ErrorEvents[U]>): boolean;
}

class ErrorEmitter extends EventEmitter {}

export const errorEmitter = new ErrorEmitter();
