import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { IngredientName } from 'src/app/model/ingredient_name.model';

const baseUrl = `${environment.backendUrl}/ingredient-names`

@Injectable({
  providedIn: 'root'
})
export class IngredientNameApiService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<IngredientName[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<IngredientName>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post<IngredientName>(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put<IngredientName>(`${baseUrl}/${id}`, params)
  }

  delete(id: string) {
    return this.http.delete<IngredientName>(`${baseUrl}/${id}`);
  }

  getAvailableIngredientTypes() {
    return this.http.get<string[]>(`${baseUrl}/ingredienttypes`)
  }

  getAvailableShopTypes() {
    return this.http.get<string[]>(`${baseUrl}/shoptypes`)
  }
}
