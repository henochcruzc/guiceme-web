import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [],
  imports: [
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatTabsModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    
    
  ],exports: [
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    MatButtonToggleModule,
    MatTabsModule  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class MaterialModule { }
