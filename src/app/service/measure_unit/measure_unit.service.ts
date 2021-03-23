/*
This code is inspired by https://stackblitz.com/edit/ngbootstrap-table?file=app%2Ftable-complete.ts
*/

import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { debounceTime, tap, switchMap, delay } from 'rxjs/operators'
import { SortDirection } from 'src/app/directive/sortable.directive';
import { AlertService } from '../alert/alert.service';
import { MeasureUnitApiService } from './measure_unit-api.service';
import { MeasureUnit } from 'src/app/model/measure_unit.model';

interface SearchResult {
  measureUnits: MeasureUnit[];
  total: number;
}

interface State {
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  sortColumn: string,
  sortDirection: SortDirection
}

let compareMeasureUnit = function (t1: MeasureUnit, t2: MeasureUnit) {
  return t1.name.toLowerCase() < t2.name.toLowerCase() ? -1 : t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : 0
}

let compareString = function (v1: string, v2: string) {
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0
}

let compareNumber = function (v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
}

function sort(measureUnits: MeasureUnit[], column: string, direction: string): MeasureUnit[] {
  if (direction === '') {
    return measureUnits;
  } else {
    return [...measureUnits].sort((a, b) => {
      let res;
      if (column === 'name') {
        res = compareString(a[column], b[column]);
      }
      if (column === 'pluralName') {
        res = compareString(a[column], b[column]);
      }

      return direction === 'asc' ? res : -res;
    })
  }
}

function matches(measureUnit: MeasureUnit, term: string, pipe: PipeTransform) {
  return measureUnit.name.toLowerCase().includes(term.toLowerCase())
    || measureUnit.pluralName.toLowerCase().includes(term.toLowerCase());
    // for a number use: || pipe.transform(tag.id).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class MeasureUnitService {
  private _measureUnits$ = new BehaviorSubject<MeasureUnit[]>([]);
  private _measureUnits: MeasureUnit[] = [];
  private dataStore: { measureUnits: MeasureUnit[] } = { measureUnits: [] }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _measureUnitPage$ = new BehaviorSubject<MeasureUnit[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  }

  constructor(
    private measureUnitApiService: MeasureUnitApiService,
    private alertService: AlertService,
    private pipe: DecimalPipe) {

    this._measureUnits$.subscribe(
      data => {
        this._measureUnits = data;
      }
    )

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._measureUnitPage$.next(result.measureUnits);
      this._total$.next(result.total);
    })
  }

  get measureUnitPage$() { return this._measureUnitPage$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.pageNumber; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get sortColumn() { return this._state.sortColumn; }
  get sortDirection() { return this._state.sortDirection; }

  set page(page: number) { console.log(`pagenumber: ${page}`); this._set({ pageNumber: page }) }
  set pageSize(pageSize: number) { this._set({ pageSize }) }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }) }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, pageNumber: page, searchTerm } = this._state;

    // 1. sort
    let measureUnits = sort(this._measureUnits, sortColumn, sortDirection);

    // 2. filter
    measureUnits = measureUnits.filter(tag => matches(tag, searchTerm, this.pipe));
    let total = measureUnits.length;

    // 3. paginate
    measureUnits = measureUnits.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ measureUnits, total });
  }

  /**
   * CRUD functions
   * Each crud function:
   *  - updates the private dataStore
   *  - copies the updated datStore to the _measureUnits$ BehaviorSubject
   *  - triggers _search$.next() to update _measureUnitPage$ and _total$
   */

  loadAll() {
    this.measureUnitApiService.getAll().subscribe(
      data => {
        this.dataStore.measureUnits = data;
        this._measureUnits$.next(Object.assign({}, this.dataStore).measureUnits)

        this._search$.next();
      },
      error => console.log('Could not load measureUnits')
    )
  }

  load(id: string): any {
    let measureUnit = this.dataStore.measureUnits.find(x => x.id.toString() === id)
    return measureUnit;
  }

  create(measureUnit: MeasureUnit) {
    this.measureUnitApiService.create(measureUnit).subscribe(
      data => {
        this.dataStore.measureUnits.push(data);
        this.dataStore.measureUnits = this.dataStore.measureUnits.sort(compareMeasureUnit);
        this._measureUnits$.next(Object.assign({}, this.dataStore).measureUnits)

        this._search$.next();

        this.alertService.success(`Maateenheid ${data.name} toegevoegd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  update(id: string, measureUnit: MeasureUnit) {
    this.measureUnitApiService.update(id, measureUnit).subscribe(
      data => {
        this.dataStore.measureUnits.forEach((t, i) => {
          if (t.id.toString() === id) {
            measureUnit.id = id;
            this.dataStore.measureUnits[i] = measureUnit;
            this.dataStore.measureUnits = this.dataStore.measureUnits.sort(compareMeasureUnit);
            this._measureUnits$.next(Object.assign({}, this.dataStore).measureUnits)

            this._search$.next();

            this.alertService.success(`Maateenheid ${data.name} gewijzigd`, { keepAfterRouteChange: true })
          }
        });
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  remove(id: string) {
    this.measureUnitApiService.delete(id).subscribe(
      data => {
        this.dataStore.measureUnits.forEach((t, i) => {
          if (t.id === id) {
            this.dataStore.measureUnits.splice(i, 1);
          }
        });
        this._measureUnits$.next(Object.assign({}, this.dataStore).measureUnits);

        this._search$.next();

        this.alertService.success(`Maateenheid ${data.name} verwijderd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }
}
