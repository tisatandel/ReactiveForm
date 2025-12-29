import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: number;
  gender: string;
  salary: number;
  city: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/employee';

  // GET
  getEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  // POST
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  // DELETE
  deleteEmployee(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.baseUrl}/${id}`);
  }
}
