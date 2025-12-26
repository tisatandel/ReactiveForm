import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface EmployeeForm
{
  name:FormControl<string | null >;
  email:FormControl<string | null >;
  phone:FormControl<number | null >;
  gender:FormControl<string | null >;
  salary:FormControl<number | null >;
  city:FormControl<string | null >;

}
@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  form = new FormGroup<EmployeeForm>({
    name:new FormControl (null,Validators.required),
    email:new FormControl (null,[Validators.required ,Validators.pattern(/^[a-zA-Z0-9._%+-]+@tag97(\.[a-zA-Z]{2,})?$/)]),
    phone: new FormControl(null, [Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]),
    gender:new FormControl (null,Validators.required),
    salary:new FormControl (null,[Validators.required,Validators.min(10000),Validators.max(50000)]),
    city:new FormControl (null,Validators.required)
  })

  OnSubmit(){
    console.log('Form Submitted');
    console.log(this.form);
    console.log(this.form.value);
  }
}
