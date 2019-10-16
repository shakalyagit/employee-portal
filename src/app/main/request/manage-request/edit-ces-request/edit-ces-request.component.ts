import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService, UserDetails } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'emp-edit-ces-request',
  templateUrl: './edit-ces-request.component.html',
  styleUrls: ['./edit-ces-request.component.scss']
})
export class EditCesRequestComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() data: any;
  @Input() cesId: number;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @Output() changedCategory: EventEmitter<any> = new EventEmitter();

  public cesDetails;
  userDetails: UserDetails;

  files = [];
  constructor(
    private _authService: AuthenticationService,
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this._authService.headerText.next({
      headerStrong: "CES(N) Update",
      headerText: "Request Form"
    });
    this.userDetails = this._authService.getUserDetails()
    this.fetchCesFormDetailsById();
    this.fetchAttachments();
  }

  fetchCesFormDetailsById() {
    this._authService.request('get', `cescontroller/getEntryById?id=${this.cesId}`).subscribe((response) => {
      console.log('fetchData', response);
      this.cesDetails = response;
      this.setValueToForm();
    })

  }

  fetchAttachments() {
    this._authService.request('get', `cescontroller/getAttachments?formCode=1&txId=${this.cesId}&userId=${this.userDetails.id}`).subscribe((response) => {
      console.log('files',response);
      this.files = response;
      console.log('files',this.files)
      // this.setValueToForm();
    })

  }

  setValueToForm() {
    const currentCes = { ...this.cesDetails };
    
    currentCes.department = this.userDetails.department;
    currentCes.grade = this.userDetails.grade;
    this.optionCategoryChange(currentCes.serviceCategory);
    this.parentForm.setValue(currentCes);
    
  }

  updateCesRequest() {
    this.parentForm.patchValue({
      attachmentIdList: this.files.map(x => x.fileId).join(',')
    })
    Swal.fire({
      title: 'Do you want to update this form?',
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
          grade: this.userDetails.gradeId
        })
        this._authService.request('put', `cescontroller/updateces/${this.cesId}?mode=1&userId=${this.userDetails.id}`, this.parentForm.value).subscribe((response) => {
          this.toastr.success('CES Request', 'Request Updated Successfully');
          this.route.navigateByUrl('request/requestlist');
        })

      }
    })
  }

  draftSave() {
    this.parentForm.patchValue({
      attachmentIdList: this.files.map(x => x.fileId).join(',')
    })
    Swal.fire({
      title: 'Do you want to draft this form?',
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
          grade: this.userDetails.gradeId
        })
        this._authService.request('put', `cescontroller/updateces/${this.cesId}?mode=0&userId=${this.userDetails.id}`, this.parentForm.value).subscribe((response) => {
          this.toastr.success('CES Request', 'Request Drafted Successfully');
          this.route.navigateByUrl('request/requestlist');
          
        })

      }
    })
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

  optionCategoryChange(event){
    console.log(event);
    this.changedCategory.emit(event);
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
      this._authService.fileRequest('post', `cescontroller/attachfile?formCode=${1}&txId=${this.cesId}&userId=${this.userDetails.id}`, formData)
        .subscribe((cesRequestDocumentResponce) => {
          console.log(cesRequestDocumentResponce);
          
          this.files.push(cesRequestDocumentResponce);
          
          // console.log(this.parentForm)
          // console.log(this.parentForm.invalid)
        }, (err) => {

          console.log(err);

        });


    }
  }


}
