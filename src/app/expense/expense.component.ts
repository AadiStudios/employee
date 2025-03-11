import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
@Component({
    selector: 'app-expense',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './expense.component.html',
    styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  expenseTypes: any[] = [];
  employeeData: any[] = [];
  showEmployeeSelect = false;
  constructor(private fb: FormBuilder, private expenseService: EmployeeService) {}

  ngOnInit() {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],  
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      employee:[null]
    });

    this.expenseService.getExpenseTypes().subscribe((data) => {
      this.expenseTypes = data;
    });
    this.expenseService.getEmployees().subscribe((data) => {
      this.employeeData = data;
    });
    
    this.expenseForm.get('type')?.valueChanges.subscribe((selectedType) => {
      if (selectedType === 'additionalPayment' || selectedType ==='Food'|| selectedType ==='Transport') {
        this.addEmployeeField();
      } else {
        this.removeEmployeeField();
      }
    });
  }

  addEmployeeField() {
    this.expenseForm.addControl('employee', this.fb.control('', Validators.required));
    this.showEmployeeSelect = true;
  }

  removeEmployeeField() {
    this.expenseForm.removeControl('employee');
    this.showEmployeeSelect = false;
  }
  
  onSubmit() {
    if (this.expenseForm.valid) {
      let formData = this.expenseForm.value;
  
      let originalDate = formData.date;
      let [year, month, day] = originalDate.split('-');
      formData.date = `${day}-${month}-${year}`;
  
      this.expenseService.addExpenseEntry(formData).then(() => {
        alert('Expense added successfully!');
        this.expenseForm.reset();
      }).catch(error => {
        console.error('Error adding expense:', error);
      });
    }
  }
}
