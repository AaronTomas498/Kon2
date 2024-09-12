import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';



@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  constructor(private platform: Platform) {}

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });

    // Verificar si photoList.value no es null antes de intentar parsearlo
    this.photos = photoList.value ? JSON.parse(photoList.value) : [];

    // If running on the web...
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }


  public async addNewToGallery(): Promise<UserPhoto> {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // Mantener URI para leer el archivo si es necesario
        source: CameraSource.Camera, // automáticamente toma una nueva foto con la cámara
        quality: 100, // calidad máxima (0 a 100)
    });

    // Convertir la imagen a base64
    const savedImageFile = await this.savePicture(capturedPhoto);

    // Añadir la nueva foto al array de fotos
    this.photos.unshift(savedImageFile);

    // Cachear todos los datos de fotos para futuras recuperaciones
    Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
    });

    // Devolver la imagen guardada para que se envíe al chat
    return savedImageFile;
}


  // Save picture to file on device
  // Modificar el método savePicture para asegurarse de que siempre se obtiene la imagen en base64
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    // Convertir la imagen a base64
    const base64Data = await this.readAsBase64(photo);

    // Escribir el archivo en el sistema de archivos
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
    });

    // Comprobar si ya existe un prefijo data:image/jpeg;base64,
    const mimeType = photo.format === 'png' ? 'image/png' : 'image/jpeg';
    const base64Prefix = `data:${mimeType};base64,`;

    // Si ya existe el prefijo, no lo añadas de nuevo
    const webviewPath = base64Data.startsWith(base64Prefix) ? base64Data : base64Prefix + base64Data;

    // Devolver un objeto con la ruta del archivo y la ruta webview (en este caso, base64 para web)
    return {
        filepath: savedFile.uri,
        webviewPath: webviewPath,  // Asegurar que el formato sea correcto
    };
}


  // Read camera photo into base64 format based on the platform the app is running on
private async readAsBase64(photo: Photo): Promise<string> {
  if (this.platform.is('hybrid')) {
      // Leer el archivo en formato base64 en una plataforma híbrida
      const file = await Filesystem.readFile({
          path: photo.path!,
      });

      // Asegurarse de que el valor sea siempre un string
      if (typeof file.data === 'string') {
          return file.data;  // Retornar directamente si es un string
      } else {
          throw new Error('El archivo no es un string');  // Lanza un error si no es un string
      }
  } else {
      // Recuperar la foto, leer como un blob, luego convertir a formato base64 en la web
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      // Convertir el blob a base64 y devolverlo como string
      return (await this.convertBlobToBase64(blob)) as string;
  }
}




  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
