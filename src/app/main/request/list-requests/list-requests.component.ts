import { HelperService } from './../../../core/services/helper.service';
import { AuthenticationService, UserDetails } from './../../../authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'emp-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.scss']
})
export class ListRequestsComponent implements OnInit {
  cesRequestList = [];
  userDetails: UserDetails;
  constructor(
    private _authService: AuthenticationService,
    private _helperService: HelperService
  ) { }

  ngOnInit() {
    this._authService.headerText.next({
      headerStrong: "CES(N) New",
      headerText: "Request Form"
    });
    this.userDetails = this._authService.getUserDetails()
    this.getCESRequestList();

  }

  public getCESRequestList(){
    this._authService.request('get',`cescontroller/getAllEntries?userId=${this.userDetails.id}`).subscribe((response)=>{
      this.cesRequestList = response;
    })
  }
  createNewRequest() {
    
  }

}
