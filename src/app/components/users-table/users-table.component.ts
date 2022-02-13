import {Component, Input, TrackByFunction} from '@angular/core';
import {User} from '../../shared/users-data';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {

  @Input() list: ReadonlyArray<User> = [];

  readonly trackByUser: TrackByFunction<User> = (index, item) => item.id;

}
