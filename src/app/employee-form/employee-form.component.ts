import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

export interface Employee {
  Empname: string;  
  aadhaarId: string;  
  designationId: string;
  photoUrl: string;
}

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './employee-form.component.html',
    styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
      employeeForm!:FormGroup;
      designations : any[] = [];
      previewUrl: string | ArrayBuffer | null = null; // To show preview

      constructor(private fb: FormBuilder, private employeeService: EmployeeService,private storage: Storage){
       
      }


    ngOnInit(): void {
        this.employeeForm = this.fb.group({
          empName : ['',Validators.required],
          designationId :['',Validators.required],
          aadhaarNumber :['',Validators.required],
          photo: [null] 
        });
      
    this.employeeService.getDataFromFirestore().subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.designations = data.map((item, index) => ({ id: index, ...item })); // Correct way
      } else {
        this.designations = []; 
      }
    
      console.log("Updated Designations:", this.designations);
    });  
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
      this.employeeForm.patchValue({ photo: file });
    }
  }
    
    async onSubmit(fileInput: HTMLInputElement) {
      if (this.employeeForm.valid) {
        const file: File = this.employeeForm.value.photo;
        let photoUrl = '';
    
        if (file) {
          try {
            const filePath = `employee_photos/${Date.now()}_${file.name}`;
            const storageRef = ref(this.storage, filePath);
            
            console.log("Uploading file:", file.name);
            const snapshot = await uploadBytes(storageRef, file);
            console.log("File uploaded successfully:", snapshot.metadata.fullPath);
    
            photoUrl = await getDownloadURL(storageRef);
            console.log("File URL:", photoUrl);
    
          } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed.");
            return;
          }
        }
    
        // Save employee data
        const employeeData = {
          Empname: this.employeeForm.value.empName,
          aadhaarId: this.employeeForm.value.aadhaarNumber,
          designationId: this.employeeForm.value.designationId,
          photoUrl: photoUrl
        };
    
        try {
          await this.employeeService.addEmployee(employeeData);
          alert('Employee added successfully');
    
          // Reset the form
          this.employeeForm.reset();
          this.previewUrl = null;
    
          // **Reset the file input manually**
          fileInput.value = '';
    
        } catch (error) {
          console.error("Error adding employee:", error);
        }
      }
    }

    
}
