import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map, shareReplay, takeUntil, tap} from 'rxjs/operators';

export interface PageBtnInfo {
  readonly index: number;
  readonly isActive: boolean;
  readonly displayValue: number;
}

export interface PaginationInfo {
  readonly indexesToDisplay: ReadonlyArray<number>;
  readonly isLeftOffset?: boolean;
  readonly isRightOffset?: boolean;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnDestroy, OnChanges {

  private _terminator$ = new Subject();

  private _count$ = new BehaviorSubject<number>(0);
  private _current$ = new BehaviorSubject<number>(0);
  private _limit$ = new BehaviorSubject<number>(5);

  private _allIndexes$ = this._count$.pipe(
    map(count => (new Array(count)).fill(0).map((_, i) => i)),
    shareReplay(1),
    takeUntil(this._terminator$)
  );

  private _paginationInfo$ = combineLatest(this._allIndexes$, this._current$, this._limit$).pipe(
    map(([numbers, current, limit]) => {
      if (numbers.length <= limit) {
        return { indexesToDisplay: numbers };
      }
      current = current || 0;
      const count = numbers.length;

      const leftOffset = Math.floor(limit / 2);
      const rightOffset = Math.ceil(limit / 2);

      let start = current - leftOffset;
      let end = current + rightOffset;

      if (start < 0) {
        const edge = 0;
        const diff = start - edge;
        start = edge;
        end -= diff;
      }

      if (end > count) {
        const edge = count;
        const diff = end - edge;
        end = edge;
        start -= diff;
      }

      const isLeftOffset = start > 0;
      const isRightOffset = end < count;

      const indexesToDisplay = numbers.slice(start, end);
      return {indexesToDisplay, isLeftOffset, isRightOffset};
    })
  );

  readonly isLeftOffset$: Observable<boolean> = this._paginationInfo$.pipe(map(({isLeftOffset}) => !!isLeftOffset));
  readonly isRightOffset$: Observable<boolean> = this._paginationInfo$.pipe(map(({isRightOffset}) => !!isRightOffset));

  readonly pages$: Observable<ReadonlyArray<PageBtnInfo>> = combineLatest(this._paginationInfo$, this._current$)
    .pipe(
      map(([{indexesToDisplay}, current]) => {

        const result: PageBtnInfo[] = indexesToDisplay.map(index => ({
          index,
          isActive: index === (current || 0),
          displayValue: index + 1
        }));

        return result;

      })
    );

  readonly isCanNext$: Observable<boolean> = combineLatest(this._count$, this._current$)
    .pipe(
      map(([count, current]) => this.isCanNext(count, current || 0))
    );

  readonly isCanPrev$: Observable<boolean> = combineLatest(this._count$, this._current$)
    .pipe(
      map(([count, current]) => this.isCanPrev(count, current || 0))
    );

  @Input() count: number = 0;
  @Input() current: number = 0;
  @Input() limit: number = 5;

  @Output() currentChange = new EventEmitter<number>();

  private isCanNext(count: number, current: number): boolean {
    return count > 0 && current < count - 1;
  }

  private isCanPrev(count: number, current: number): boolean {
    return count > 0 && current > 0;
  }

  goToPage(index: number): void {
    this.current = index;
    this.currentChange.emit(index);
    this._current$.next(index);
  }

  goFirst(): void {
    if (!this.isCanPrev(this.count, this.current)) {
      return;
    }
    this.goToPage(0);
  }

  goLast(): void {
    if (!this.isCanNext(this.count, this.current)) {
      return;
    }
    this.goToPage(this.count - 1);
  }

  goPrevious(): void {
    if (!this.isCanPrev(this.count, this.current)) {
      return;
    }
    this.goToPage(this.current - 1);
  }

  goNext(): void {
    if (!this.isCanNext(this.count, this.current)) {
      return;
    }
    this.goToPage(this.current + 1);
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
    this._count$.complete();
    this._current$.complete();
    this._limit$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {count, current, limit} = changes;

    if (count?.previousValue !== count?.currentValue) {
      this._count$.next(count?.currentValue || 0);
    }

    if (current?.previousValue !== current?.currentValue) {
      this._current$.next(current?.currentValue || 0);
    }

    if (limit?.previousValue !== limit?.currentValue) {
      this._limit$.next(limit?.currentValue || 0);
    }
  }

}
