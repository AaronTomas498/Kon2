import { Component } from '@angular/core';
import { ActionSheetController, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PhotoService, UserPhoto } from '../../services/photo.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CamaraComponent {
  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Enviar',
          icon: 'send',
          handler: () => {
            this.modalController.dismiss(photo);
          }
        },
        {
          text: 'Borrar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async addPhotoAndSend() {
    const capturedPhoto = await this.photoService.addNewToGallery();
    if (capturedPhoto) {
        this.modalController.dismiss(capturedPhoto);
    }
}


  closeModal() {
    this.modalController.dismiss();
  }
}
