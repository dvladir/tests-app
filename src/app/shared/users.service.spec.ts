import {UsersService} from './users.service';
import {TestBed} from '@angular/core/testing';
import {USERS} from './users-data';

describe('User service', () => {
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService]
    });
    usersService = TestBed.inject(UsersService);
  });

  it('Method invokes', async () => {

    let data = await usersService.loadUsersPageable(3, 0).toPromise();

    expect(data).toEqual({
      currentPage: 0,
      pageSize: 3,
      totalPages: 9,
      totalElements: USERS.length,
      elements: USERS.slice(0, 3)
    });

    data = await usersService.loadUsersPageable(4, 1).toPromise();

    expect(data).toEqual({
      currentPage: 1,
      pageSize: 4,
      totalPages: 7,
      totalElements: USERS.length,
      elements: USERS.slice(4, 8)
    });

    expect(true).toBeTrue();
  })


});
