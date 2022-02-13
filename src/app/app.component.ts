import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Select, Store} from "@ngxs/store";
import {UsersState} from "./store/users.state";
import {PaginationData} from "./shared/pagination-data";
import {User} from "./shared/users-data";
import {ChangePage} from "./store/users.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private _store: Store
  ) {
  }

  @Select(UsersState.inProgress) inProgress$!: Observable<boolean>;
  @Select(UsersState.usersPage) usersPage$!: Observable<PaginationData<User>>;

  set currentPage(value: number) {
    if (value === this.currentPage) {
      return;
    }
    this._store.dispatch(new ChangePage(value));
  }

  get currentPage(): number {
    const result = this._store.selectSnapshot(UsersState.currentPage);
    return result;
  }

  ngOnInit(): void {
    this._store.dispatch(new ChangePage(this.currentPage));
  }

}
