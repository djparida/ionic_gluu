import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatExpansionModule, matExpansionAnimations} from '@angular/material/expansion';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [
    FolderPage
  ]
})
export class FolderPageModule {}
