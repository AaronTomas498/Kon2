import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private mensajesDB: AngularFireList<Message>;

  constructor(private db: AngularFireDatabase) {
    // Inicializa la referencia a la base de datos, ordenando por timestamp
    this.mensajesDB = this.db.list('/messages', ref =>
      ref.orderByChild('timestamp')
    );
  }

  // Método para obtener todos los mensajes
  getMessages(): Observable<Message[]> {
    return this.mensajesDB.valueChanges();
  }

  // Método para añadir un nuevo mensaje
  addMessage(message: Message): void {
    this.mensajesDB.push(message);
  }
}