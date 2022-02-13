import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {User, USERS} from './users-data';
import {PaginationData} from './pagination-data';

const TIMEOUT = 100;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  loadUsersPageable(pageSize: number, currentPage: number): Observable<PaginationData<User>> {

    const users = [...USERS];

    const totalElements = users.length;

    let totalPages: number = Math.floor(totalElements / pageSize);
    if (totalElements % pageSize !== 0) {
      totalPages++;
    }
    const start = currentPage * pageSize;
    const end = start + pageSize;

    const elements = users.slice(start, end);

    const result: PaginationData<User> = {currentPage, pageSize, totalPages, totalElements, elements};

    return timer(TIMEOUT).pipe(
      tap(_ => console.log('REMOTE')),
      map(_ => result)
    );
  }

}
