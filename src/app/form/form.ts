import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Emp, EmployeeService } from '../API/employee-service';
import { firstValueFrom, Observable } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

interface EmployeeForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<number | null>;
  gender: FormControl<string | null>;
  salary: FormControl<number | null>;
  city: FormControl<string | null>;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgForOf, NgIf],
  templateUrl: './form.html',
})
export class Form implements OnInit {

  employees$!: Observable<Emp[]>;

  private cdr = inject(ChangeDetectorRef);
  private employees = inject(EmployeeService);

  form = new FormGroup<EmployeeForm>({
    id: new FormControl(null),
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@tag97(\.[a-zA-Z]{2,})?$/)
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[6-9]\\d{9}$')
    ]),
    gender: new FormControl(null, Validators.required),
    salary: new FormControl(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(100000)
    ]),
    city: new FormControl(null, Validators.required),
  });

  isEditMode = false;

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employees$ = this.employees.getEmployee();
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      const res = await firstValueFrom(
        this.employees.createEmployee(this.form.value as Emp)
      );

      alert('Employee Added Successfully');
      this.form.reset();
      this.loadEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again!');
    }
  }

  editEmployee(emp: Emp) {
    this.isEditMode = true;
    this.form.setValue({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      gender: emp.gender,
      phone: emp.phone,
      salary: emp.salary,
      city: emp.city
    });
  }

  async updateEmployee() {
    const id = this.form.value.id;
    if (!id) return alert('Please select employee to update');

    try {
      const res = await firstValueFrom(
        this.employees.updateEmployee(id, this.form.value as Emp)
      );

      alert('Employee Updated Successfully');
      this.form.reset();
      this.isEditMode = false;
      this.loadEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again!');
    }
  }

  async deleteEmployee(id: string | null) {
    if (!id) return;

    try {
      await firstValueFrom(this.employees.deleteEmployee(id));
      alert('Employee Deleted Successfully');
      this.form.reset();
      this.isEditMode = false;
      this.loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee. Please try again!');
    }
  }

  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
  }
}