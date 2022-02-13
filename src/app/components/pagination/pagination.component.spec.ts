import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PaginationComponent} from './pagination.component';
import {NO_ERRORS_SCHEMA, SimpleChange} from '@angular/core';

const getContent = (fixture: ComponentFixture<PaginationComponent>) => {

  const element: HTMLElement = fixture.nativeElement as HTMLElement;
  const btnFirst = element.querySelector('.t_btn-first');
  const btnPrev = element.querySelector('.t_btn-prev');
  const btnNext = element.querySelector('.t_btn-next');
  const btnLast = element.querySelector('.t_btn-last');
  const leftOffset = element.querySelector('.t_left-offset');
  const rightOffset = element.querySelector('.t_right-offset');
  const items = element.querySelectorAll('.t_item');
  const activeItem = element.querySelector('.t_item.active');

  return {
    btnFirst,
    btnPrev,
    btnLast,
    btnNext,
    leftOffset,
    rightOffset,
    items,
    activeItem
  };
};

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component.count).toBe(0);
    expect(component.current).toBe(0);
    expect(component.limit).toBe(5);

    const x = getContent(fixture);
    expect(x.btnFirst).not.toBeNull();
    expect(x.btnPrev).not.toBeNull();
    expect(x.btnNext).not.toBeNull();
    expect(x.btnLast).not.toBeNull();
    expect(x.leftOffset).toBeNull();
    expect(x.rightOffset).toBeNull();
    expect(x.activeItem).toBeNull();
    expect(x.items.length).toBe(0);
  });

  it('limit change', () => {
    component.count = 10;
    component.ngOnChanges({
      count: new SimpleChange(0, component.count, false)
    });
    fixture.detectChanges();

    let x = getContent(fixture);
    expect(x.items.length).toBe(5);
    expect(x.leftOffset).toBeNull();
    expect(x.rightOffset).not.toBeNull();

    component.current = 5;
    component.ngOnChanges({
      current: new SimpleChange(0, component.current, false)
    });
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.items.length).toBe(5);
    expect(x.leftOffset).not.toBeNull();
    expect(x.rightOffset).not.toBeNull();

    component.goLast();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.items.length).toBe(5);
    expect(x.leftOffset).not.toBeNull();
    expect(x.rightOffset).toBeNull();

    component.current = 5;
    component.limit = 10;
    component.ngOnChanges({
      limit: new SimpleChange(0, component.limit, false),
      current: new SimpleChange(0, component.current, false)
    });
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.items.length).toBe(10);
    expect(x.leftOffset).toBeNull();
    expect(x.leftOffset).toBeNull();
  });

  it('navigation change', async () => {
    component.count = 10;
    component.ngOnChanges({
      count: new SimpleChange(0, component.count, false)
    });
    fixture.detectChanges();

    let x = getContent(fixture);
    expect(x.activeItem!.textContent).toEqual('1');
    expect(component.current).toBe(0);

    x.btnNext!.querySelector('a')!.click();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.activeItem!.textContent).toEqual('2');
    expect(component.current).toBe(1);

    x.btnLast!.querySelector('a')!.click();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.activeItem!.textContent).toEqual('10');
    expect(component.current).toBe(9);

    x.btnPrev!.querySelector('a')!.click();
    fixture.detectChanges();

    x = getContent(fixture);
    expect(x.activeItem!.textContent).toEqual('9');
    expect(component.current).toBe(8);

    component.goToPage(4);
    fixture.detectChanges();

    expect(component.current).toBe(4);
  });

  it('Event emition', () => {
    const spyEmit = jest.spyOn(component.currentChange, 'emit');

    component.count = 10;
    component.ngOnChanges({
      count: new SimpleChange(0, component.count, false)
    });
    fixture.detectChanges();

    const x = getContent(fixture);
    expect(component.current).toBe(0);
    expect(component.currentChange.emit).not.toHaveBeenCalled();

    x.btnNext!.querySelector('a')!.click();
    fixture.detectChanges();

    expect(component.current).toBe(1);
    expect(component.currentChange.emit).toHaveBeenCalledWith(1);

    x.btnNext!.querySelector('a')!.click();
    fixture.detectChanges();

    expect(component.current).toBe(2);
    expect(component.currentChange.emit).toHaveBeenCalledWith(2);
  });

  it('Check methods', () => {
    const spyGoToPage = jest.spyOn(component, 'goToPage');
    component.count = 10;
    component.ngOnChanges({
      count: new SimpleChange(0, component.count, false)
    });

    spyGoToPage.mockClear();
    component.goPrevious();
    expect(component.goToPage).not.toHaveBeenCalled();

    spyGoToPage.mockClear();
    component.goFirst();
    expect(component.goToPage).not.toHaveBeenCalled();

    component.current = 2;

    spyGoToPage.mockClear();
    component.goPrevious();
    expect(component.goToPage).toHaveBeenCalledWith(1);

    spyGoToPage.mockClear();
    component.goFirst();
    expect(component.goToPage).toHaveBeenCalledWith(0);

    component.current = 9;

    spyGoToPage.mockClear();
    component.goNext();
    expect(component.goToPage).not.toHaveBeenCalled();

    spyGoToPage.mockClear();
    component.goLast();
    expect(component.goToPage).not.toHaveBeenCalled();

    component.current = 7;

    spyGoToPage.mockClear();
    component.goNext();
    expect(component.goToPage).toHaveBeenCalledWith(8);

    spyGoToPage.mockClear();
    component.goLast();
    expect(component.goToPage).toHaveBeenCalledWith(9);

  });

});
