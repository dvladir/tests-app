import {UsersTableComponent} from './components/users-table/users-table.component';
import {AppComponent} from './app.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {UsersService} from './shared/users.service';
import {fireEvent, render, screen} from '@testing-library/angular';
import {timer} from 'rxjs';
import {User, USERS} from './shared/users-data';

type UserShort = Pick<User, 'firstName' | 'middleName' | 'lastName'>;

describe('AppComponent', () => {

  const setup = async () => {
    const r = await render(AppComponent, {
      declarations: [PaginationComponent, UsersTableComponent],
      providers: [UsersService],
    });
    r.fixture.autoDetectChanges();
    return r;
  }

  const getUsers = (users: User[]): UserShort[] => users
    .map(({firstName, middleName, lastName}) => ({firstName, middleName, lastName}));

  const getElements = (rows: HTMLElement[]): UserShort[] => rows.map(row => {
    const cells = row.querySelectorAll('td');
    const firstName = cells[0].innerHTML.trim();
    const middleName = cells[1].innerHTML.trim();
    const lastName = cells[2].innerHTML.trim();
    return {firstName, middleName, lastName};
  });

  it('Default view', async () => {
    await setup();
    await timer(200).toPromise();
    const rows = screen.getAllByTestId('usersTableRow');
    const actualElements = getElements(rows);
    const expectedElements = getUsers(USERS.slice(0, 6));
    expect(actualElements).toEqual(expectedElements);
  });

  it('Page change', async () => {
    await setup();
    await timer(200).toPromise();

    const pagination = screen.getByTestId('pagination');
    const btnNext = pagination.querySelector('.t_btn-next > a');
    expect(btnNext).not.toBeNull();

    fireEvent.click(btnNext!);
    await timer(200).toPromise();

    const rows = screen.getAllByTestId('usersTableRow');
    const actualElements = getElements(rows);
    const expectedElements = getUsers(USERS.slice(6, 12));
    expect(actualElements).toEqual(expectedElements);
  });

/*
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: UsersService;
  let spy: jasmine.Spy;

  beforeEach(async () => {
    const testBed = TestBed.configureTestingModule({
      declarations: [ UsersTableComponent, AppComponent, PaginationComponent ],
      providers: [UsersService]
    });

    service = testBed.inject(UsersService);
    spy = spyOn(service, 'loadUsersPageable').and.callThrough();

    await testBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('Default view', async () => {
    expect(service.loadUsersPageable).toHaveBeenCalledWith(6,0);
    await fixture.whenRenderingDone();

    const pagination = fixture.debugElement.query(By.directive(PaginationComponent));
    expect(pagination.componentInstance.limit).toEqual(6);
    expect(pagination.componentInstance.current).toEqual(0);
    expect(pagination.componentInstance.count).toEqual(5);

    const table = fixture.debugElement.query(By.directive(UsersTableComponent));
    expect(table.componentInstance.list).toEqual(USERS.slice(0, 6));
  });

  it('Page change', async () => {
    await fixture.whenRenderingDone();

    component.currentPage = 1;
    expect(service.loadUsersPageable).toHaveBeenCalledWith(6,1);
    fixture.detectChanges();
    await timer(200).toPromise();
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const pagination = fixture.debugElement.query(By.directive(PaginationComponent));
    expect(pagination.componentInstance.limit).toEqual(6);
    expect(pagination.componentInstance.current).toEqual(1);
    expect(pagination.componentInstance.count).toEqual(5);

    const table = fixture.debugElement.query(By.directive(UsersTableComponent));
    expect(table.componentInstance.list).toEqual(USERS.slice(6, 12));
  })
*/
})
