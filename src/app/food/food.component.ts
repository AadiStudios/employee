import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
    selector: 'app-food',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './food.component.html',
    styleUrl: './food.component.css'
})
export class FoodComponent implements OnInit {
  foodForm!: FormGroup;
  employees: any[] = [];

  constructor(private fb: FormBuilder, private foodService: EmployeeService,private router: Router) {}

  ngOnInit() {
    this.foodForm = this.fb.group({
      date: ['', Validators.required],
      employee: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });

    this.foodService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
 
  onSubmit() {
    if (this.foodForm.valid) {
      const formData = this.foodForm.value;
  
      let originalDate = formData.date; 
      let [year, month, day] = originalDate.split('-');
      formData.date = `${day}-${month}-${year}`; 
  
      this.foodService.addFoodEntry(formData).then(() => {
        alert('Food entry added successfully!');
        this.foodForm.reset();
      }).catch(error => {
        console.error('Error adding food entry:', error);
      });
    }
  }
}
