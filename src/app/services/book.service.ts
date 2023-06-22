import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://fakerestapi.azurewebsites.net/api/v1/Books';

  constructor(private http: HttpClient) { }

  createBook(book: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, book);
  }

  getBooks() {
    return this.http.get<any>(this.apiUrl);
  }
  
  getBook(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }
  
  updateBook(id: number, book: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, book);
  }
  
  deleteBook(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
  
  searchBooks(query: string): Observable<any> {
    const url = `${this.apiUrl}?title=${query}`;
    return this.http.get<any>(url);
  }
  
  
}
