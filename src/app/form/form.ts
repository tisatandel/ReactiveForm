import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Emp, EmployeeService } from '../API/employee-service';

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
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
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
  loadEmployees() {
  this.employees.getEmployee().subscribe(res => {
    this.employeeList = res;
    this.cdr.detectChanges();
  });
}

  // Add new employee
  onSubmit() {
    if (!this.form.valid) return;

    this.employees.createEmployee(this.form.value as Emp).subscribe(res => {
      alert('Employee Added Successfully');
      this.employeeList.push(res); // Add directly to table without reloading
      this.form.reset();
    });
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
  updateEmployee() {
    const id = this.form.value.id;
    if (!id) return alert('Please select employee to update');

    this.employees.updateEmployee(id, this.form.value as Emp).subscribe(res => {
      alert('Employee Updated Successfully');
      // Update table locally
      const index = this.employeeList.findIndex(emp => emp.id === id);
      if (index !== -1) {
        this.employeeList[index] = { ...this.form.value } as Emp;
      }
      this.form.reset();
      this.isEditMode = false;
    });
  }

  // Delete employee
  deleteEmployee(id: string | null) {
  if (!id) return;

  this.employees.deleteEmployee(id).subscribe(() => {
    alert('Employee Deleted Successfully');

    for (let i = 0; i < this.employeeList.length; i++) {
      if (this.employeeList[i].id === id) {
        this.employeeList.splice(i, 1);
        break;
      }
    }

    this.form.reset();
    this.isEditMode = false;
  });
}

  // Cancel editing
  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
  }
}