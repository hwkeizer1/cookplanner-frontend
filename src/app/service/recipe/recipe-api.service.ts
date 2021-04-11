import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/model/recipe.model';

import { environment } from 'src/environments/environment'

const baseUrl = `${environment.backendUrl}/recipes`

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Recipe[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Recipe>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post<Recipe>(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put<Recipe>(`${baseUrl}/${id}`, params)
  }

  delete(id: string) {
    return this.http.delete<Recipe>(`${baseUrl}/${id}`);
  }
}
