import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response';
import { Product, SaveProduct } from '../interfaces/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getAll(name: string = '', state: number | null = null, currency: string = '') {
    let params = `?active=true`;
    if (name) params += `&name=${name}`;
    if (state !== null) params += `&state=${state}`;
    if (currency) params += `&currency=${currency}`;

    return this.http.get<ApiResponse<Product[]>>(`${environment.api}/v1/products${params}`);
  }


  create(request: SaveProduct) {
    return this.http.post<ApiResponse<Product>>(`${environment.api}/v1/products`, request);
  }

  update(id: number, request: SaveProduct) {
    return this.http.put<ApiResponse<Product>>(`${environment.api}/v1/products/${id}`, request);
  }

  inactive(id: number) {
    return this.http.delete<ApiResponse<any>>(`${environment.api}/v1/products/${id}/inactive`);
  }

}
