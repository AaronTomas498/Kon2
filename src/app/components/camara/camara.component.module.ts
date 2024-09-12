import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CamaraComponent } from './camara.component';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: CamaraComponent }])
  ],
  declarations: [CamaraComponent]
})
export class Tab2PageModule {}
