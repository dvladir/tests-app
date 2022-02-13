import {NgxsModule, Store} from "@ngxs/store";
import {TestBed} from "@angular/core/testing";
import {UsersState} from "./users.state";
import {ChangePage, SetProgressStatus} from "./users.actions";
import {UsersService} from "../shared/users.service";
import {PaginationData} from "../shared/pagination-data";
import {User} from "../shared/users-data";

const PAGE_A: PaginationData<User> = {
  currentPage: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
  elements: []
};

const PAGE_B: PaginationData<User> = {
  currentPage: 2,
  pageSize: 6,
  totalPages: 11,
  totalElements: 61,
  elements: [{
    id: 'xyz',
    firstName: 'foo',
    lastName: 'bar',
    middleName: 'baz'
  }]
};

describe('UserState', () => {
  let store: Store;
  let state: UsersState;
  let service: UsersService;

  const isStateEmpty = () => {
    const isPageEmpty = (page: PaginationData<any>) =>
      page.currentPage === 0 &&
      page.pageSize === 0 &&
      page.totalPages === 0 &&
      page.totalElements === 0 &&
      page.elements.length === 0;

    return store.selectSnapshot(state => isPageEmpty(state.users.usersPage));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UsersState])],
      providers: [UsersService]
    })
    store = TestBed.inject(Store);
    state = TestBed.inject(UsersState);
    service = TestBed.inject(UsersService);

    jest.spyOn(service, 'loadUsersPageable');
    jest.spyOn(state, 'setProgressStatus');
  });

  it('Progress action', () => {
    let inProgress = store.selectSnapshot(state => state.users.inProgress);
    expect(inProgress).toBeFalsy();

    store.dispatch(new SetProgressStatus(true));
    inProgress = store.selectSnapshot(state => state.users.inProgress);
    expect(inProgress).toBeTruthy();

    store.dispatch(new SetProgressStatus(false));
    inProgress = store.selectSnapshot(state => state.users.inProgress);
    expect(inProgress).toBeFalsy();
  });

  it('Page change action', async () => {

    expect(service.loadUsersPageable).not.toHaveBeenCalled();
    expect(state.setProgressStatus).toHaveBeenCalledTimes(0);
    expect(isStateEmpty()).toBeTruthy();

    await store.dispatch(new ChangePage(1)).toPromise();

    expect(service.loadUsersPageable).toHaveBeenCalled();
    expect(state.setProgressStatus).toHaveBeenNthCalledWith(1, expect.anything(), new SetProgressStatus(true));
    expect(state.setProgressStatus).toHaveBeenNthCalledWith(2, expect.anything(), new SetProgressStatus(false));
    expect(isStateEmpty()).toBeFalsy();
  });

  it('Selector in progress', () => {
    let inProgress = UsersState.inProgress({usersPage: PAGE_A, inProgress: true});
    expect(inProgress).toBeTruthy();

    inProgress = UsersState.inProgress({usersPage: PAGE_B, inProgress: false});
    expect(inProgress).toBeFalsy();
  });

  it('Selector page', () => {
    let usersPage = UsersState.usersPage({usersPage: PAGE_A, inProgress: false});
    expect(usersPage).toEqual(PAGE_A);

    usersPage = UsersState.usersPage({usersPage: PAGE_B, inProgress: false});
    expect(usersPage).toEqual(PAGE_B);
  });

  it('Current page', () => {
    let currentPage = UsersState.currentPage(PAGE_A);
    expect(currentPage).toEqual(0);

    currentPage = UsersState.currentPage(PAGE_B);
    expect(currentPage).toEqual(2);
  });

})
