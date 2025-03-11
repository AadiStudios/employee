import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-wages',
    templateUrl: './wages.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    styleUrls: ['./wages.component.css']
})
export class WagesComponent implements OnInit {
  wagesForm!: FormGroup;
  employees: any[] = [];
  designations: any[] = [];

  constructor(private fb: FormBuilder, private employeeService: EmployeeService,private router: Router) {}

  ngOnInit() {
    this.wagesForm = this.fb.group({
      date: ['', Validators.required],
      employeeName: ['', Validators.required],
      grade: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });

    this.fetchEmployees();
    // this.fetchDesignations();
  }

  fetchEmployees() {
    this.employeeService.getDataFromFirestore().subscribe((data) => {
      this.designations = data; 
    });

    this.employeeService.getEmployees().subscribe((data) => {
      //  console.log(data);
      this.employees = data; 
    });
  }



  onSubmit() {
    if (this.wagesForm.valid) {
      let formData = this.wagesForm.value;
        let originalDate = formData.date; 
      let [year, month, day] = originalDate.split('-');
      formData.date = `${day}-${month}-${year}`; 
  
      this.employeeService.addWages(formData).then(() => {
        alert('Expense added successfully!');
        this.wagesForm.reset();
      }).catch(error => {
        console.error('Error adding expense:', error);
      });
    }
  }
  navigateToEmployee() {
    this.router.navigate(['/employee']);
  }
}
