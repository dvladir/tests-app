export class SetProgressStatus {
  static readonly type = '[USERS] update progress status';
  constructor(
    public inProgress: boolean
  ) {
  }
}

export class ChangePage {
  static readonly type = `[USERS] change page`;
  constructor(
    public page: number,
    public pageSize: number = 6
  ) {
  }
}
