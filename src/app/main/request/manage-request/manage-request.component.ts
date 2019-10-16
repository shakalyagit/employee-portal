import { AuthenticationService, UserDetails } from './../../../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MobileValidator } from 'src/app/core/validators/contact.validator';
@Component({
  selector: 'emp-manage-request',
  templateUrl: './manage-request.component.html',
  styleUrls: ['./manage-request.component.scss']
})
export class ManageRequestComponent implements OnInit {

  public cesId: number;

  public cesform: FormGroup;
  userDetails: UserDetails;
  public data = {
    'tlName': [
      // {'value': 'Indranil Saha'}
    ],
    'category': [
      // { 'value': 'New Telephone' },
      // { 'value': 'Existing Telephone' },
      // { 'value': 'Direct Phone' },
      // { 'value': 'Walkie-Talki' }
    ],
    'subcategory': [
      // { 'value': 'Intercom' },
      // { 'value': 'Standard' },
      // { 'value': 'Intrinsically Safe' },
      // { 'value': 'Fixed-Station' },
      // { 'value': 'Vehicle Mounted' }
    ]
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthenticationService
  ) {
    this.cesId = this._activatedRoute.snapshot.params.id;
    console.log(this.cesId);
  }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails()
    this.getSanctioningAuthority();
    this.getServiceCategory();
    // this.getServiceSubCategory();
     if (!this.cesId) {
      this.cesform = this._formBuilder.group({
        requestorName: ['', Validators.compose([Validators.required])],
        empCode: ['', Validators.compose([Validators.required])],
        department: ['', Validators.compose([Validators.required])],
        grade: ['', Validators.compose([Validators.required])],
        requestorLocation: ['', Validators.compose([Validators.required])],
        sanctioningAuhority: ['', Validators.compose([Validators.required])],
        mobileNo: ['', Validators.compose([MobileValidator("Mobile is not in valid format")])],
        contactNo: ['', Validators.compose([Validators.required])],
        serviceCategory: ['', Validators.compose([Validators.required])],
        serviceSubCategory: ['', Validators.compose([Validators.required])],
        justification: ['', Validators.compose([Validators.required])],
        requirement: ['', Validators.compose([Validators.required])],
        attachmentIdList: [''],

      });
    } else {
      this.cesform = this._formBuilder.group({
        requestorName: ['', Validators.compose([Validators.required])],
        empCode: ['', Validators.compose([Validators.required])],
        department: ['', Validators.compose([Validators.required])],
        grade: ['', Validators.compose([Validators.required])],
        requestorLocation: ['', Validators.compose([Validators.required])],
        sanctioningAuhority: ['', Validators.compose([Validators.required])],
        mobileNo: ['', Validators.compose([MobileValidator("Mobile is not in valid format")])],
        contactNo: ['', Validators.compose([Validators.required])],
        serviceCategory: ['', Validators.compose([Validators.required])],
        serviceSubCategory: ['', Validators.compose([Validators.required])],
        justification: ['', Validators.compose([Validators.required])],
        requirement: ['', Validators.compose([Validators.required])],
        cesId: [''],
        createdBy: [''],
        createdOn: [''],
        updatedBy: [''],
        updatedOn: [''],
        taskName: [''],
        status: [''],
        wfInstanceId: [''],
        attachmentIdList: [''],
        assignee: [''],
        sanctioningAuhorityDisplayName: [''],
        serviceCategoryDisplayName: [''],
        serviceSubCategoryDisplayName:['']
      });
    }

  }

  getSanctioningAuthority() {
    this._authService.request('get', `fe/getTLS?empId=${this.userDetails.id}`).subscribe((response) => {
      this.data['tlName'] = response;
    })

  }

  getServiceCategory() {
    this._authService.request('get', `fe/getList?formCode=1&fieldName=ServiceCategory&parent=0`).subscribe((response) => {
      this.data['category'] = response;
    })
  }

  getServiceSubCategory(event) {
    this._authService.request('get', `fe/getList?formCode=1&fieldName=ServiceSubCategory&parent=${event}`).subscribe((response) => {
      this.data['subcategory'] = response;
    })
  }

  addNewCes() {
    // console.log(this.cesform.value);
  }

}
