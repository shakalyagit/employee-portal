import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserDetails  } from 'src/app/authentication.service';

@Component({
  selector: 'emp-view-ces-request',
  templateUrl: './view-ces-request.component.html',
  styleUrls: ['./view-ces-request.component.scss']
})
export class ViewCesRequestComponent implements OnInit {
  public cesform: FormGroup;

  public cesId;
  public cesDetails;
  userDetails: UserDetails;

  public data = {
    'tlName': [{
    //  'value':'Indranil Saha'
    }],
    'category': [
    //  {'value':'New Telephone'}, 
    //  {'value':'Existing Telephone'},
    //  {'value':'Direct Phone'},
    //  {'value':'Walkie-Talki'}
    ],
    'subcategory': [
    //  {'value':'Intercom'},
    //  {'value':'Standard'}, 
    //  {'value':'Intrinsically Safe'}, 
    //  {'value':'Fixed-Station'}, 
    //  {'value':'Vehicle Mounted'}
     ]
  }

  constructor(
    private _authService: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder
    ) { 
     
    }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails()
    this.getSanctioningAuthority();
    this.getServiceCategory();
    this._authService.headerText.next({
      headerStrong: "CES(N) View",
      headerText: "Request Form"
    });

    this.cesform = this._formBuilder.group({
      requestorName: ['', Validators.compose([Validators.required])],
      empCode: ['', Validators.compose([Validators.required])],
      department: ['', Validators.compose([Validators.required])],
      grade: ['', Validators.compose([Validators.required])],
      requestorLocation: ['', Validators.compose([Validators.required])],
      sanctioningAuhority: ['', Validators.compose([Validators.required])],
      mobileNo: ['', Validators.compose([])],
      contactNo: ['', Validators.compose([Validators.required])],
      serviceCategory: ['', Validators.compose([Validators.required])],
      serviceSubCategory: ['', Validators.compose([Validators.required])],
      justification: ['', Validators.compose([Validators.required])],
      requirement: ['', Validators.compose([Validators.required])],
      wfInstanceId: [''],
      attachmentIdList: [''],
      assignee: ['']
    });

    this.cesId = this._activatedRoute.snapshot.params.id; 
    this.fetchCesFormDetailsById()
  }
  fetchCesFormDetailsById(){
    this._authService.request('get',`cescontroller/getEntryById?id=${this.cesId}`).subscribe((response)=>{
      console.log(response);
      this.cesDetails = {...response};
      this.setValueToForm();
    })

  }

  setValueToForm(){
    const currentCes = {...this.cesDetails};
    delete currentCes.cesId;
    delete currentCes.createdBy;
    delete currentCes.createdOn;
    delete currentCes.updatedBy;
    delete currentCes.updatedOn;
    delete currentCes.taskName;
    delete currentCes.status;
    currentCes.department = this.userDetails.department;
    currentCes.grade = this.userDetails.grade;
    this.getServiceSubCategory(currentCes.serviceCategory);
    this.cesform.setValue(currentCes);
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
}
