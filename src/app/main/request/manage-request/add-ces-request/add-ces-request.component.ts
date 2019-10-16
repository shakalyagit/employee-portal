import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'emp-add-ces-request',
  templateUrl: './add-ces-request.component.html',
  styleUrls: ['./add-ces-request.component.scss']
})
export class AddCesRequestComponent implements OnInit, AfterViewInit {

  @Input() parentForm: FormGroup;
  @Input() data: any;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @Output() changedCategory: EventEmitter<any> = new EventEmitter();

  files =[];

  fullName: string = '';
  userDetails: UserDetails;

  constructor(
    private _authService: AuthenticationService,
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this._authService.headerText.next({
      headerStrong: "CES(N) Add",
      headerText: "Request Form"
    });

    this.userDetails = this._authService.getUserDetails()
    this.fullName = this.userDetails.firstName + ' ' + this.userDetails.lastName
  }

  ngAfterViewInit() {
    this.parentForm.patchValue({
      requestorName: this.fullName,
      empCode: this.userDetails.employeeId,
      department: this.userDetails.department,
      grade: this.userDetails.grade,
      mobileNo: this.userDetails.phoneNumber,
      contactNo: this.userDetails.extNumber
    })
  }

  submitCes() {
    console.log(this.parentForm.value);
    Swal.fire({
      title: 'Do you want to submit this form?',
      text: "Concern person will be notified",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit it!'
    }).then((result) => {
      if (result.value) {

        this.parentForm.patchValue({
          department: this.userDetails.departmentId,
          grade: this.userDetails.gradeId,
          attachmentIdList: this.files.map(x => x.fileId).join(',')
        })
        this._authService.request('post', `cescontroller/saveces?mode=1&userId=${this.userDetails.id}`, this.parentForm.value).subscribe((response) => {
          this.toastr.success('CES Request', 'Request Added Successfully');
          this.route.navigateByUrl('request/requestlist')
        })

      }
    })
  }



  submitAsDraftCes() {
    
    this.parentForm.patchValue({
      department: this.userDetails.departmentId,
      grade: this.userDetails.gradeId,
      attachmentIdList: this.files.map(x => x.fileId).join(',')
    })
    this._authService.request('post', `cescontroller/saveces?mode=0&userId=${this.userDetails.id}`, this.parentForm.value).subscribe((response) => {
      this.toastr.success('CES Request', 'Request Drafted Successfully');
      this.route.navigateByUrl('request/requestlist')
    })

    // console.log(this.parentForm.value);
    // Swal.fire({
    //   title: 'Do you want to submit this form?',
    //   text: "Concern person will be notified",
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, Submit it!'
    // }).then((result) => {
    //   if (result.value) {

        

    //   }
    // })
  }


  close() {
    console.log(this.parentForm.touched)
    if (this.parentForm.touched) {
      Swal.fire({
        title: 'Do you want to leave this page?',
        text: "Your unsaved data will be lost",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Close it!'
      }).then((result) => {
        if (result.value) {
          this.route.navigateByUrl('request/requestlist')
        }
      })
    } else {
      this.route.navigateByUrl('request/requestlist')
    }
  }

  get phone() {
    if (this.userDetails.phoneNumber) {
      return true
    }
    return false;
  }

  uploadFile(event) {
    console.log(event.target.files);

    if (event.target.files && event.target.files.length) {
      // this.loading = true;
      const files = event.target.files[0];
      let formData = new FormData();
      // for (var i = 0; i < files.length; i++) {
      //   formData.append("fileUpload", files[i], files[i].name);
      // }
      formData.append('uploadFile', files, files.name);
      this._authService.fileRequest('post', `cescontroller/attachfile?formCode=${1}&txId=${0}&userId=${this.userDetails.id}`, formData)
        .subscribe((cesRequestDocumentResponce) => {
          console.log(cesRequestDocumentResponce);
          this.files.push(cesRequestDocumentResponce);
          this.parentForm.markAsTouched();
        }, (err) => {

          console.log(err);

        });


    }
  }
  optionCategoryChange(event){
    this.changedCategory.emit(event);
  }

  // get file(){
  //   return this._authService.fileUrl(this.fileIds[0])
  // }

}
