import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UsersService} from './shared/users.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  constructor(
    private _users: UsersService
  ) {
  }

  readonly _currentPage$ = new BehaviorSubject(0);

  set currentPage(value: number) {
    if (value === this.currentPage) {
      return;
    }
    this._currentPage$.next(value);
  }

  get currentPage(): number {
    return this._currentPage$.value;
  }

  readonly pageSize = 6;

  readonly usersPage$ = this._currentPage$.pipe(
    switchMap(page => this._users.loadUsersPageable(this.pageSize, page))
  );

  ngOnDestroy(): void {
    this._currentPage$.complete();
  }
}
