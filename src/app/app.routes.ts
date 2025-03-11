import { Routes } from '@angular/router';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { WagesComponent } from './wages/wages.component';
import { FoodComponent } from './food/food.component';
import { ExpenseComponent } from './expense/expense.component';

import { RestrictedComponent } from './restricted/restricted.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { MaterialtableComponent } from './materialtable/materialtable.component';
import { materialize } from 'rxjs';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'table',component:MaterialtableComponent},
  { path: 'unauthorized', component:RestrictedComponent },

  { path: 'employee', component: EmployeeFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'report', component: MaterialtableComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  { path: 'wage', component: WagesComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'normal'] } },
  { path: 'expense', component: ExpenseComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'normal'] } }

];