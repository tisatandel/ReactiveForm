import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Emp {
  id: string | null;
  name: string | null;
  email: string | null;
  gender: string | null;
  phone: number | null;
  salary: number | null;
  city: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/employee';

  getEmployee(): Observable<Emp[]> {
    return this.http.get<Emp[]>(`${this.api}`);
  }
  createEmployee(emp: Emp): Observable<Emp> {
    return this.http.post<Emp>(this.api, emp);
  }
  updateEmployee(id: string, emp: Emp) {
    return this.http.put(`${this.api}/${id}`, emp);
  }
  deleteEmployee(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}