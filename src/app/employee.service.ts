import { Injectable } from '@angular/core';
import {Firestore,collection,addDoc,collectionData,query,orderBy} from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import {doc, getDoc, getDocs } from '@angular/fire/firestore'
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

interface Employee{
    Empname: string;
    designationId: string;
    aadhaarId: string;
    photoUrl: string;
}

interface Wages{
   Date: Date;
   Empname: string;
   Grade: string;
   Amount: string;
   Description: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firestore:Firestore) {

   }

   addEmployee(employee: Employee){
    const employeeCollection = collection(this.firestore,'employees');
    return addDoc(employeeCollection, employee);
   }
   addWages(wages: Wages){
    const wageCollection = collection(this.firestore,'wages');
    return addDoc(wageCollection, wages);
   }
   addFoodEntry(foodData: any) {
    const foodCollection = collection(this.firestore, 'food');
    return addDoc(foodCollection, foodData);
  }
  
  addExpenseEntry(expenseData: any) {
    const expenseCollection = collection(this.firestore, 'expenseData');
    return addDoc(expenseCollection, expenseData);
  }
  
  getDataFromFirestore(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'designation');
    const orderedQuery = query(collectionRef, orderBy('id', 'asc')); 

    return from(getDocs(orderedQuery)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));
      })
    );
  }

  getExpenseData(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'expenseData');
    const orderedQuery = query(collectionRef, orderBy('date', 'asc'));

    return from(getDocs(orderedQuery)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  getWagesData(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'wages');
    const orderedQuery = query(collectionRef, orderBy('date', 'asc'));

    return from(getDocs(orderedQuery)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  getEmployees(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'employees');
    // const orderedQuery = query(collectionRef, orderBy('id', 'asc')); 

    return from(getDocs(collectionRef)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));
      })
    );
  }

  getExpenseTypes(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'expense');
    return from(getDocs(collectionRef)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    );
  }
}
