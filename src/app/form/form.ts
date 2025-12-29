import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService, Employee } from '../API/employee-service';

interface EmployeeForm {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<number | null>;
  gender: FormControl<string | null>;
  salary: FormControl<number | null>;
  city: FormControl<string | null>;
}

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class Form {

  private http = inject(EmployeeService);
  

  form = new FormGroup<EmployeeForm>({
    id: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@tag97(\.[a-zA-Z]{2,})?$/)
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/)
    ]),
    gender: new FormControl(null, Validators.required),
    salary: new FormControl(null, [
      Validators.required,
      Validators.min(10000),
      Validators.max(50000)
    ]),
    city: new FormControl(null, Validators.required)

  });

  OnSubmit() {
    console.log('Form Submitted');
    console.log(this.form);
    console.log(this.form.value);

    this.http.getEmployee().subscribe((employees) => {
      console.log(employees);
    });

    this.http.addEmployee(this.form.value as Employee).subscribe((employee) => {
      console.log('Employee added:', employee);
    });

      {
        const id = this.form.value.id!;
        if(id !==null)
        {
            this.http.deleteEmployee(id).subscribe((employee) => {
                console.log('Employee deleted:', employee);
              });
        }
      }

  }
}