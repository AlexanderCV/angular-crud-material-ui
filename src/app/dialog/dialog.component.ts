import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  productForm!: FormGroup;
  actionBtn : string = "Save";

  constructor(private fb:FormBuilder,
              private _api:ApiService,
              @Inject(MAT_DIALOG_DATA) public editData: any, 
              private _dialogRef: MatDialogRef<DialogComponent>){ }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category:['',Validators.required ],
      freshness:['',Validators.required ],
      price: ['',Validators.required ],
      comment: ['',Validators.required ],
      date: ['',Validators.required ],
    })
    
    if(this.editData){
      this.actionBtn = "update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct(){
    if (!this.editData) {
      if(this.productForm.valid){
       this._api.postProduct(this.productForm.value)
       .subscribe({
        next:(rest) =>{
          alert("Product added successfully");
          this.productForm.reset();
          this._dialogRef.close('save');
        },  
        error:() =>{
          alert("Error while adding the product")
        }
       });
    }
    }else{
      this.updateProduct();
    }
  }
  updateProduct(){
    this._api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next: res => {
        alert("Product updated Successfully");
        this.productForm.reset();
        this._dialogRef.close('update');
      },
      error: () =>{
        alert("Error while updating the record !!!");
      }
    })

  }

}
