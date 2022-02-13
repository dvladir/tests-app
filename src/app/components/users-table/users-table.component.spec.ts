import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableComponent } from './users-table.component';
import {createUser, User} from '../../shared/users-data';

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('No users', () => {
    expect(component.list.length).toBe(0);

    const tableRows = fixture.nativeElement.querySelectorAll('tbody > tr');
    expect(tableRows.length).toBe(1);

    const emptyRow = tableRows[0];
    const emptyCells = emptyRow.querySelectorAll('td');
    expect(emptyCells.length).toBe(1);

    expect(emptyCells[0].innerText).toBe('No Data');
  });

  it('Users exists', () => {
    const users: ReadonlyArray<User> = [
      createUser('John', 'Alfred', 'Doe'),
      createUser('Lorrin', 'Celine', 'Urquhart'),
      createUser('Leon', 'Rebeccanne', 'Tollemache'),
    ];
    component.list = users;
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody > tr');
    expect(tableRows.length).toBe(3);

    const noData = fixture.nativeElement.querySelector('.no-data');
    expect(noData).toBeNull();
  });
});
