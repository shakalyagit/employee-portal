import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  success = false;
  submitted = false;

  loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

  }
  onSubmitLogin() {
    console.log(this.loginForm.value);
    this._authService.request('post', 'users/login', this.loginForm.value).subscribe((response) => {
      console.log(response)
      this.router.navigateByUrl('dashboard');
    })
  }
}
