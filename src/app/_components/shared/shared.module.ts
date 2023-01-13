import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

//import { MomentDateAdapter, MatMomentDateModule } from '@angular/material-moment-adapter';
/* esta declaracion es muy importante al momento de usar mat-datepicker-toggle  */
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    //formGroup
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatNativeDateModule, 
    

    MatSliderModule, MatSidenavModule, MatDividerModule, MatCardModule, MatPaginatorModule,
    MatTableModule, MatMenuModule, LayoutModule, MatListModule,
    MatExpansionModule, MatGridListModule, MatDialogModule, FormsModule, 
    MatCheckboxModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatInputModule,
    MatProgressSpinnerModule, MatSortModule,  
    MatTabsModule, DragDropModule, ScrollingModule
    
  ],

  exports: [
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    //formGroup
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,

    MatSliderModule, MatSidenavModule, MatDividerModule, MatCardModule, MatPaginatorModule,
    MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, LayoutModule, MatButtonModule, MatListModule,
    MatExpansionModule, MatGridListModule,MatSnackBarModule, MatDialogModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatInputModule,
    MatSlideToggleModule, MatProgressSpinnerModule, MatSortModule, MatNativeDateModule, 
    MatTabsModule, DragDropModule, ScrollingModule
                
  ],

  providers: [
    //MY_FORMATS es la constante que esta declarada
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]

  
})
export class SharedModule { }
