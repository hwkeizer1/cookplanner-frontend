/*
This code is inspired by https://stackblitz.com/edit/ngbootstrap-table?file=app%2Ftable-complete.ts
*/
import { Injectable, OnInit, PipeTransform } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { debounceTime, tap, switchMap, delay } from 'rxjs/operators'
import { SortDirection } from 'src/app/directive/sortable.directive';
import { AlertService } from '../alert/alert.service';
import { DecimalPipe } from '@angular/common';

import { IngredientName } from 'src/app/model/ingredient_name.model';
import { IngredientNameApiService } from './ingredient_name-api.service';

interface SearchResult {
  ingredientNames: IngredientName[];
  total: number;
}

interface State {
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  sortColumn: string,
  sortDirection: SortDirection
}

let compareIngredientName = function (t1: IngredientName, t2: IngredientName) {
  return t1.name.toLowerCase() < t2.name.toLowerCase() ? -1 : t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : 0
}

let compareString = function (v1: string, v2: string) {
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0
}

let compareNumber = function (v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
}

function sort(ingredientNames: IngredientName[], column: string, direction: string): IngredientName[] {
  if (direction === '') {
    return ingredientNames;
  } else {
    return [...ingredientNames].sort((a, b) => {
      let res;
      if (column === 'name') {
        res = compareString(a[column], b[column]);
      }
      if (column === 'pluralName') {
        res = compareString(a[column], b[column]);
      }
      if (column === 'stock') {
        res = compareNumber(a[column], b[column]);
      }
      if (column === 'shopType') {
        res = compareNumber(a[column], b[column]);
      }
      if (column === 'ingredientType') {
        res = compareNumber(a[column], b[column]);
      }
      return direction === 'asc' ? res : -res;
    })
  }
}

function matches(ingredientName: IngredientName, term: string, pipe: PipeTransform) {
  return ingredientName.name.toLowerCase().includes(term.toLowerCase())
    || ingredientName.pluralName.toLowerCase().includes(term.toLowerCase())
    || ingredientName.ingredientType?.toLowerCase().includes(term.toLowerCase())
    || ingredientName.shopType?.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class IngredientNameService {
  private _ingredientNames$ = new BehaviorSubject<IngredientName[]>([]);
  private _ingredientNames: IngredientName[] = [];
  private dataStore: { ingredientNames: IngredientName[] } = { ingredientNames: [] }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _ingredientNamePage$ = new BehaviorSubject<IngredientName[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _availableIngredientTypes?: string[];
  private _availableShopTypes?: string[];

  private _state: State = {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  }

  constructor(
    private ingredientNameApiService: IngredientNameApiService,
    private alertService: AlertService,
    private pipe: DecimalPipe) {

    this._ingredientNames$.subscribe(
      data => {
        this._ingredientNames = data;
      }
    )

    this.ingredientNameApiService.getAvailableIngredientTypes().subscribe(
      data => {
        this._availableIngredientTypes = data;
      }
    )

    this.ingredientNameApiService.getAvailableShopTypes().subscribe(
      data => {
        this._availableShopTypes = data;
      }
    )

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._ingredientNamePage$.next(result.ingredientNames);
      this._total$.next(result.total);
    })
  }

  get ingredientNamePage$() { return this._ingredientNamePage$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.pageNumber; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get sortColumn() { return this._state.sortColumn; }
  get sortDirection() { return this._state.sortDirection; }
  get availableIngredientTypes() { return this._availableIngredientTypes; }
  get availableShopTypes() { return this._availableShopTypes; }
  get allIngredientNames() { return this._ingredientNames$.asObservable(); }

  set page(page: number) { this._set({ pageNumber: page }) }
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
    let ingredientNames = sort(this._ingredientNames, sortColumn, sortDirection);

    // 2. filter
    ingredientNames = ingredientNames.filter(ingredientName => matches(ingredientName, searchTerm, this.pipe));
    let total = ingredientNames.length;

    // 3. paginate
    ingredientNames = ingredientNames.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ ingredientNames, total });
  }

  /**
 * CRUD functions
 * Each crud function:
 *  - updates the private dataStore
 *  - copies the updated datStore to the _tags$ BehaviorSubject
 *  - triggers _search$.next() to update _tagPage$ and _total$
 */

  loadAll() {
    this.ingredientNameApiService.getAll().subscribe(
      data => {
        this.dataStore.ingredientNames = data;
        this._ingredientNames$.next(Object.assign({}, this.dataStore).ingredientNames)

        this._search$.next();
      },
      error => console.log('Could not load ingredientNames')
    )
  }

  load(id: string): any {
    let ingredientName = this.dataStore.ingredientNames.find(x => x.id.toString() === id)
    return ingredientName;
  }

  create(ingredientName: IngredientName) {
    this.ingredientNameApiService.create(ingredientName).subscribe(
      data => {
        this.dataStore.ingredientNames.push(data);
        this.dataStore.ingredientNames = this.dataStore.ingredientNames.sort(compareIngredientName);
        this._ingredientNames$.next(Object.assign({}, this.dataStore).ingredientNames)

        this._search$.next();

        this.alertService.success(`Categorie ${data.name} toegevoegd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  update(id: string, ingredientName: IngredientName) {
    this.ingredientNameApiService.update(id, ingredientName).subscribe(
      data => {
        this.dataStore.ingredientNames.forEach((t, i) => {
          if (t.id.toString() === id) {
            ingredientName.id = id;
            this.dataStore.ingredientNames[i] = ingredientName;
            this.dataStore.ingredientNames = this.dataStore.ingredientNames.sort(compareIngredientName);
            this._ingredientNames$.next(Object.assign({}, this.dataStore).ingredientNames)

            this._search$.next();

            this.alertService.success(`Categorie ${data.name} gewijzigd`, { keepAfterRouteChange: true })
          }
        });
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  remove(id: string) {
    this.ingredientNameApiService.delete(id).subscribe(
      data => {
        this.dataStore.ingredientNames.forEach((t, i) => {
          if (t.id === id) {
            this.dataStore.ingredientNames.splice(i, 1);
          }
        });
        this._ingredientNames$.next(Object.assign({}, this.dataStore).ingredientNames);

        this._search$.next();

        this.alertService.success(`Categorie ${data.name} verwijderd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }
}
