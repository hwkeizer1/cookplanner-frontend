import { Injectable, PipeTransform } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { debounceTime, tap, switchMap, delay } from 'rxjs/operators'
import { SortDirection } from 'src/app/directive/sortable.directive';
import { AlertService } from '../alert/alert.service';
import { DecimalPipe } from '@angular/common';

import { Recipe } from 'src/app/model/recipe.model';
import { RecipeApiService } from './recipe-api.service';

interface SearchResult {
  recipes: Recipe[];
  total: number;
}

interface State {
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  sortColumn: string,
  sortDirection: SortDirection
}

let compareRecipe = function (t1: Recipe, t2: Recipe) {
  return t1.name.toLowerCase() < t2.name.toLowerCase() ? -1 : t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : 0
}

let compareString = function (v1: string, v2: string) {
  return v1.toLowerCase() < v2.toLowerCase() ? -1 : v1.toLowerCase() > v2.toLowerCase() ? 1 : 0
}

let compareNumber = function (v1, v2) {
  return v1 < v2 ? 1 : v1 > v2 ? -1 : 0
}

let compareDate = function (v1: Date | any, v2: Date | any) {
  var x = Date.parse(v1);
  var y = Date.parse(v2);
  if (x == y) { return 0; }
  if (isNaN(x) || x < y) {return 1}
  if (isNaN(y) || x > y) {return -1}
  return 0;
}

function sort(recipes: Recipe[], column: string, direction: string): Recipe[] {
  if (direction === '') {
    return recipes;
  } else {
    return [...recipes].sort((a, b) => {
      let res;
      if (column === 'name') {
        res = compareString(a[column], b[column]);
      }
      if (column === 'recipeType') {
        res = compareString(a[column], b[column]);
      }
      if (column ==='timesServed') {
        res = compareNumber(a[column], b[column]);
      }
      if (column ==='lastServed') {
        res = compareDate(a[column], b[column]);
      }
      return direction === 'asc' ? res : -res;
    })
  }
}

function matches(recipe: Recipe, term: string, pipe: PipeTransform) {
  return recipe.name.toLowerCase().includes(term.toLowerCase())
    || recipe.recipeType?.toLowerCase().includes(term.toLowerCase());
}


@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);
  private _recipes: Recipe[] = [];
  private dataStore: { recipes: Recipe[] } = { recipes: [] }

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _recipePage$ = new BehaviorSubject<Recipe[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _availableRecipeTypes?: string[];

  private _state: State = {
    pageNumber: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  }

  constructor(
    private recipeApiService: RecipeApiService,
    private alertService: AlertService,
    private pipe: DecimalPipe) {

    this._recipes$.subscribe(
      data => {
        this._recipes = data;
      }
    )

    this.recipeApiService.getAvailableRecipeTypes().subscribe(
      data => {
        this._availableRecipeTypes = data;
      }
    )

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._recipePage$.next(result.recipes);
      this._total$.next(result.total);
    })
  }

  get recipePage$() { return this._recipePage$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.pageNumber; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get sortColumn() { return this._state.sortColumn; }
  get sortDirection() { return this._state.sortDirection; }

  set page(page: number) { this._set({ pageNumber: page }) }
  set pageSize(pageSize: number) { this._set({ pageSize }) }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }) }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  get availableRecipeTypes() { return this._availableRecipeTypes; }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, pageNumber: page, searchTerm } = this._state;

    // 1. sort
    let recipes = sort(this._recipes, sortColumn, sortDirection);

    // 2. filter
    recipes = recipes.filter(recipe => matches(recipe, searchTerm, this.pipe));
    let total = recipes.length;

    // 3. paginate
    recipes = recipes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ recipes, total });
  }

  /**
   * CRUD functions
   * Each crud function:
   *  - updates the private dataStore
   *  - copies the updated datStore to the _tags$ BehaviorSubject
   *  - triggers _search$.next() to update _tagPage$ and _total$
   */

  loadAll() {
    this.recipeApiService.getAll().subscribe(
      data => {
        this.dataStore.recipes = data;
        this._recipes$.next(Object.assign({}, this.dataStore).recipes)

        this._search$.next();
      },
      error => console.log('Could not load recipes')
    )
  }

  load(id: string): any {
    let recipe = this._recipes.find(x => x.id.toString() === id)
    return recipe;
  }

  create(recipe: Recipe) {
    this.recipeApiService.create(recipe).subscribe(
      data => {
        this.dataStore.recipes.push(data);
        this.dataStore.recipes = this.dataStore.recipes.sort(compareRecipe);
        this._recipes$.next(Object.assign({}, this.dataStore).recipes)

        this._search$.next();

        this.alertService.success(`Recept ${data.name} toegevoegd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  update(id: string, recipe: Recipe) {
    this.recipeApiService.update(id, recipe).subscribe(
      data => {
        this.dataStore.recipes.forEach((t, i) => {
          if (t.id.toString() === id) {
            recipe.id = id;
            this.dataStore.recipes[i] = recipe;
            this.dataStore.recipes = this.dataStore.recipes.sort(compareRecipe);
            this._recipes$.next(Object.assign({}, this.dataStore).recipes)
  
            this._search$.next();

            this.alertService.success(`Recept ${data.name} gewijzigd`, { keepAfterRouteChange: true })
          }
        });
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  remove(id: string) {
    this.recipeApiService.delete(id).subscribe(
      data => {
        this.dataStore.recipes.forEach((t, i) => {
          if (t.id.toString() === id) {
            this.dataStore.recipes.splice(i, 1);
          }
        });
        this._recipes$.next(Object.assign({}, this.dataStore).recipes);

        this._search$.next();

        this.alertService.success(`Recept ${data.name} verwijderd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }
}
