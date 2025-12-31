import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Emp, EmployeeService } from '../API/employee-service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';


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
  imports: [ReactiveFormsModule,AsyncPipe],
  templateUrl: './form.html',
  styleUrl: './form.css',
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

  employeeList: Emp[] = [];
  isEditMode = false;

  ngOnInit() {
    this.loadEmployees();
  }

 // Load all employees initially
//   loadEmployees() {
//   this.employees.getEmployee().subscribe(res => {
//     this.employeeList = res;
//     this.cdr.detectChanges();
//   });
// }

protected loadEmployees(): void {
  console.log('loadEmployees');
  this.employees$ = this.employees.getEmployee();
}

  // Add new employee
  // onSubmit() {
  //   if (!this.form.valid) return;

  //    this.employees.createEmployee(this.form.value as Emp).subscribe(res => {
  //     alert('Employee Added Successfully');
  //      this.employeeList.push(res); 
  //      this.form.reset();
  //    });
  

async onSubmit() {
  if (this.form.invalid) return;

  try {
    await firstValueFrom(this.employees$);
    const res = await firstValueFrom(
      this.employees.createEmployee(this.form.value as Emp)
    );

    console.log('Added Employee:', res); 
    alert('Employee Added Successfully');

    this.form.reset();
    this.loadEmployees(); 
  } catch (error) {
    console.error('Error adding employee:', error);
    alert('Failed to add employee. Please try again!');
  }
}
  // Populate form for editing
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

  // Update employee
  // updateEmployee() {
  //   const id = this.form.value.id;
  //   if (!id) return alert('Please select employee to update');

  //   this.employees.updateEmployee(id, this.form.value as Emp).subscribe(res => {
  //     alert('Employee Updated Successfully');
  //     // Update table locally
  //     const index = this.employeeList.findIndex(emp => emp.id === id);
  //     if (index !== -1) {
  //       this.employeeList[index] = { ...this.form.value } as Emp;
  //     }
  //     this.form.reset();
  //     this.isEditMode = false;
  //   });
  // }

  async updateEmployee() {
  const id = this.form.value.id;
  if (!id) return alert('Please select employee to update');

  try {
    // Update employee via API
    const res = await firstValueFrom(
      this.employees.updateEmployee(id, this.form.value as Emp)
    );

    console.log('Updated Employee:', res);  // console me data
    alert('Employee Updated Successfully');

    this.form.reset();
    this.isEditMode = false;

    // Table refresh via observable
    this.loadEmployees();
  } catch (error) {
    console.error('Error updating employee:', error);
    alert('Failed to update employee. Please try again!');
  }
}


//   // Delete employee
//   deleteEmployee(id: string | null) {
//   if (!id) return;

//   this.employees.deleteEmployee(id).subscribe(() => {
//     alert('Employee Deleted Successfully');

//     for (let i = 0; i < this.employeeList.length; i++) {
//       if (this.employeeList[i].id === id) {
//         this.employeeList.splice(i, 1);
//         break;
//       }
//     }

//     this.form.reset();
//     this.isEditMode = false;
//   });
// }

async deleteEmployee(id: string | null) {
  if (!id) return;

  try {
    await firstValueFrom(this.employees.deleteEmployee(id));

    alert('Employee Deleted Successfully');
    console.log('Deleted Employee ID:', id);

    this.form.reset();
    this.isEditMode = false;

    this.loadEmployees();
  } catch (error) {
    console.error('Error deleting employee:', error);
    alert('Failed to delete employee. Please try again!');
  }
}
  // Cancel editing
  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
  }
}