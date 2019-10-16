import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { InputValidationComponent } from './input-validation/input-validation.component';
import { InputOptionListComponent } from './input-option-list/input-option-list.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { SubmitButtonComponent } from './submit-button/submit-button.component';
import { ButtonComponent } from './button/button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    InputFieldComponent,
    TextareaFieldComponent,
    InputOptionListComponent,
    InputValidationComponent,
    ModalComponent,
    SubmitButtonComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputFieldComponent,
    TextareaFieldComponent,
    InputOptionListComponent,
    InputValidationComponent,
    ModalComponent,
    SubmitButtonComponent,
    ButtonComponent

  ]

})
export class UiModule { }
