import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-materialtable',
    imports: [CommonModule, FormsModule],
    templateUrl: './materialtable.component.html',
    styleUrl: './materialtable.component.css'
})
export class MaterialtableComponent {
  combinedData: any[] = [];
  paginatedData: any[] = [];
  
  fromDate: string = "";
  toDate: string = "";

  currentPage: number = 1;
  recordsPerPage: number = 20;
  totalPages: number = 1;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchData();
  }

  parseCustomDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  fetchData() {
    let wagesMap = new Map<string, { total: number; employees: { name: string; amount: number }[] }>();
    let expenseMap = new Map<string, { total: number; breakdown: { type: string; amount: number; employee: string }[] }>();
    let records: any[] = [];
  
    this.employeeService.getWagesData().subscribe(wages => {
      wages.forEach(wage => {
        let key = wage.date;
        if (!wagesMap.has(key)) {
          wagesMap.set(key, { total: 0, employees: [] });
        }
        wagesMap.get(key)!.total += wage.amount;
        wagesMap.get(key)!.employees.push({ name: wage.employeeName, amount: wage.amount });
      });
  
      this.employeeService.getExpenseData().subscribe(expenses => {
        expenses.forEach(expense => {
          let key = expense.date;
          if (!expenseMap.has(key)) {
            expenseMap.set(key, { total: 0, breakdown: [] });
          }
          let breakdownEntry: any = { type: expense.type || 'Unknown', amount: expense.amount };
          if (expense.type === "additionalPayment" || expense.type === "Food" || expense.type === "Transport") {
            breakdownEntry.employee = expense.employee;
          }
          expenseMap.get(key)!.total += expense.amount;
          expenseMap.get(key)!.breakdown.push(breakdownEntry);
        });
  
        let allDates = new Set([...wagesMap.keys(), ...expenseMap.keys()]);
        allDates.forEach(date => {
          let wageData = wagesMap.get(date);
          let expenseData = expenseMap.get(date);
  
          if (wageData) {
            records.push({ date: date, debit: 'Total Wages', credit: 'Cash', amount: wageData.total });
            wageData.employees.forEach(emp => {
              records.push({ date: date, debit: emp.name, credit: 'Wages', amount: emp.amount });
            });
          }
  
          if (expenseData) {
            records.push({ date: date, debit: 'Additional Expenses', credit: 'Cash', amount: expenseData.total });
            expenseData.breakdown.forEach(exp => {
              records.push({
                date: date,
                debit: (exp.type === "Food" || exp.type === "additionalPayment" || exp.type === "Transport")
                  ? `${exp.type} - ${exp.employee}`
                  : exp.type,
                credit: 'Cash',
                amount: exp.amount
              });
            });
          }
        });
  
        this.combinedData = records.sort((a, b) => this.parseCustomDate(a.date).getTime() - this.parseCustomDate(b.date).getTime());
  
        this.filterData(); 
      });
    });
  }
  
  filterData() {
    let filteredData = this.combinedData;
  
    if (this.fromDate && this.toDate) {
      let from = new Date(this.fromDate);
      let to = new Date(this.toDate);
  
      to.setDate(to.getDate() + 1);
      filteredData = this.combinedData.filter(row => {
        let rowDate = this.parseCustomDate(row.date); 
        return rowDate > from && rowDate < to; 
      });
    }
  
    this.totalPages = Math.ceil(filteredData.length / this.recordsPerPage);
    this.currentPage = 1; 
    this.paginateData(filteredData);
  }
  

  paginateData(data: any[]) {
    let start = (this.currentPage - 1) * this.recordsPerPage;
    let end = start + this.recordsPerPage;
    this.paginatedData = data.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData(this.combinedData);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData(this.combinedData);
    }
  }

  downloadPDF() {
    const doc = new jsPDF();
    doc.text("Financial Summary", 15, 10);

    const sortedData = this.combinedData.sort((a, b) => {
      return this.parseCustomDate(a.date).getTime() - this.parseCustomDate(b.date).getTime();
    });

    let tableData: any[] = [];
    let currentDate = "";
    let dateWiseTotal = 0;
    let grandTotalExpense = 0;

    sortedData.forEach((item, index) => {
      if (currentDate !== item.date) {
        if (currentDate !== "") {
          tableData.push(["", "Total Expense", "", dateWiseTotal]);
          grandTotalExpense += dateWiseTotal;
        }
        currentDate = item.date;
        dateWiseTotal = 0;
      }
      tableData.push([item.date, item.debit, item.credit, item.amount]);
      if (item.debit === "Total Wages" || item.debit === "Additional Expenses") {
        dateWiseTotal += item.amount;
      }
      if (index === sortedData.length - 1) {
        tableData.push(["", "Total Expense", "", dateWiseTotal]);
        grandTotalExpense += dateWiseTotal;
      }
    });

    tableData.push(["", "Grand Total Expense", "", grandTotalExpense]);

    autoTable(doc, {
      head: [['Date', 'Debit', 'Credit', 'Amount']],
      body: tableData
    });

    doc.save("Financial_Summary.pdf");
  }
}
