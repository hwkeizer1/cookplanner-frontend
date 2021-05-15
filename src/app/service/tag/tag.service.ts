/*
This code is inspired by https://stackblitz.com/edit/ngbootstrap-table?file=app%2Ftable-complete.ts
*/
import { Injectable, PipeTransform } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { debounceTime, tap, switchMap, delay } from 'rxjs/operators'
import { SortDirection } from 'src/app/directive/sortable.directive';
import { AlertService } from '../alert/alert.service';
import { DecimalPipe } from '@angular/common';

import { Tag } from 'src/app/model/tag.model';
import { TagApiService } from './tag-api.service';

interface SearchResult {
  tags: Tag[];
  total: number;
}

interface State {
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  sortColumn: string,
  sortDirection: SortDirection
}

let compareTag = function (t1: Tag, t2: Tag) {
  return t1.name.toLowerCase() < t2.name.toLowerCase() ? -1 : t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : 0
}

let compareString = function (v1: string, v2: string) {
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0
}

let compareNumber = function (v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
}

function sort(tags: Tag[], column: string, direction: string): Tag[] {
  if (direction === '') {
    return tags;
  } else {
    return [...tags].sort((a, b) => {
      let res;
      if (column === 'name') {
        res = compareString(a[column], b[column]);
      }
      if (column === 'id') {
        res = compareNumber(a[column], b[column]);
      }

      return direction === 'asc' ? res : -res;
    })
  }
}

function matches(tag: Tag, term: string, pipe: PipeTransform) {
  return tag.name.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private _tags$ = new BehaviorSubject<Tag[]>([]);
  private _tags: Tag[] = [];
  private dataStore: { tags: Tag[] } = { tags: [] }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tagPage$ = new BehaviorSubject<Tag[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  }

  constructor(
    private tagApiService: TagApiService,
    private alertService: AlertService,
    private pipe: DecimalPipe) {
    
    this._tags$.subscribe(
      data => {
        this._tags = data;
      }
    )

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._tagPage$.next(result.tags);
      this._total$.next(result.total);
    })

    this.loadAll();
  }

  get tagPage$() { return this._tagPage$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.pageNumber; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get sortColumn() { return this._state.sortColumn; }
  get sortDirection() { return this._state.sortDirection; }
  get allAvailableTags() { return this._tags$.asObservable(); }

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
    let tags = sort(this._tags, sortColumn, sortDirection);

    // 2. filter
    tags = tags.filter(tag => matches(tag, searchTerm, this.pipe));
    let total = tags.length;

    // 3. paginate
    tags = tags.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ tags, total });
  }

  /**
   * CRUD functions
   * Each crud function:
   *  - updates the private dataStore
   *  - copies the updated datStore to the _tags$ BehaviorSubject
   *  - triggers _search$.next() to update _tagPage$ and _total$
   */

  loadAll() {
    this.tagApiService.getAll().subscribe(
      data => {
        this.dataStore.tags = data;
        this._tags$.next(Object.assign({}, this.dataStore).tags)

        this._search$.next();
      },
      error => console.log('Could not load tags')
    )
  }

  load(id: string): any {
    let tag = this.dataStore.tags.find(x => x.id.toString() === id)
    return tag;
  }

  create(tag: Tag) {
    this.tagApiService.create(tag).subscribe(
      data => {
        this.dataStore.tags.push(data);
        this.dataStore.tags = this.dataStore.tags.sort(compareTag);
        this._tags$.next(Object.assign({}, this.dataStore).tags)

        this._search$.next();

        this.alertService.success(`Categorie ${data.name} toegevoegd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  update(id: string, tag: Tag) {
    this.tagApiService.update(id, tag).subscribe(
      data => {
        this.dataStore.tags.forEach((t, i) => {
          if (t.id.toString() === id) {
            tag.id = id;
            this.dataStore.tags[i] = tag;
            this.dataStore.tags = this.dataStore.tags.sort(compareTag);
            this._tags$.next(Object.assign({}, this.dataStore).tags)
  
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
    this.tagApiService.delete(id).subscribe(
      data => {
        this.dataStore.tags.forEach((t, i) => {
          if (t.id === id) {
            this.dataStore.tags.splice(i, 1);
          }
        });
        this._tags$.next(Object.assign({}, this.dataStore).tags);

        this._search$.next();

        this.alertService.success(`Categorie ${data.name} verwijderd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }
}
