export type AppErrorType = "RoomNotFound" | "SessionExpired" | "Unknown";
export class AppError<T extends AppErrorType = AppErrorType> {
  constructor(public type: T) {}
}
