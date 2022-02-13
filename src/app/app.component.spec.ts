import {UsersTableComponent} from './components/users-table/users-table.component';
import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {UsersService} from './shared/users.service';
import {By} from '@angular/platform-browser';
import {USERS} from './shared/users-data';
import {timer} from 'rxjs';

describe('AppComponent', () => {

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
})
