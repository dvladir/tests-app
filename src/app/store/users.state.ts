import {PaginationData} from "../shared/pagination-data";
import {User} from "../shared/users-data";
import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {UsersService} from "../shared/users.service";
import {ChangePage, SetProgressStatus} from "./users.actions";

export interface UsersStateModel {
  usersPage: PaginationData<User>;
  inProgress: boolean;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    usersPage: {
      currentPage: 0,
      pageSize: 0,
      totalPages: 0,
      totalElements: 0,
      elements: []
    },
    inProgress: false
  }
})
@Injectable()
export class UsersState {

  constructor(
    private _api: UsersService,
    private _store: Store
  ) {
  }

  @Selector()
  static inProgress(state: UsersStateModel): boolean {
    return state.inProgress;
  }

  @Selector()
  static usersPage(state: UsersStateModel): PaginationData<User> {
    return state.usersPage;
  }

  @Selector([UsersState.usersPage])
  static currentPage(userPage: PaginationData<User>): number {
    return userPage.currentPage;
  }

  @Action(SetProgressStatus)
  setProgressStatus(ctx: StateContext<UsersStateModel>, {inProgress}: SetProgressStatus): void {
    ctx.patchState({inProgress});
  }

  @Action(ChangePage)
  async changePage(ctx: StateContext<UsersStateModel>, {pageSize, page}: ChangePage): Promise<unknown> {
    ctx.dispatch(new SetProgressStatus(true));

    try {
      const usersPage = await this._api.loadUsersPageable(pageSize, page).toPromise();
      ctx.patchState({usersPage});
    } catch (e) {
      console.error(e);
    } finally {
      ctx.dispatch(new SetProgressStatus(false));
    }

    return undefined;
  }
}
