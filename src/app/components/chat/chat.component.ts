import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/interfaces/message.model';
import { CamaraComponent } from '../camara/camara.component';
import { UserPhoto } from '../../services/photo.service';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messageForm: FormGroup;
  messages$: Observable<Message[]>;
  senderId: string | null = null;
  sender: string = 'Guest';
  currentUser$: Observable<User | null>;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private shouldScroll = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private modalController: ModalController
  ) {
    this.messageForm = this.fb.group({
      messageInput: ['', Validators.required],
    });
    this.currentUser$ = this.authService.getCurrentUser();
    this.messages$ = this.messageService.getMessages();
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.sender = user.displayName || user.email || 'Unknown User';
        this.senderId = user.uid;
      }
    });

    this.messages$.subscribe(() => {
      this.shouldScroll = true;  // Activa el scroll cuando se cargan nuevos mensajes
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false; // Evita scrolls innecesarios en otras verificaciones
    }
  }

  async sendMessage(photo?: UserPhoto): Promise<void> {
    const messageText = this.messageForm.get('messageInput')?.value || '';
  
    if (messageText.trim() || photo) {
      let location = null;
  
      try {
        const position = await Geolocation.getCurrentPosition();
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        console.error('Error obteniendo la ubicación:', error);
        // Puedes manejar el error de la forma que prefieras, por ejemplo, enviando el mensaje sin ubicación.
      }
  
      const newMessage: Message = {
        id: this.senderId!,
        text: messageText,
        sender: this.sender,
        timestamp: Date.now(),
        photo: photo ? photo.webviewPath : null,
        location, // Añadimos la ubicación al mensaje
      };
  
      this.messageService.addMessage(newMessage);
      this.messageForm.reset();
      this.shouldScroll = true;
    }
  }
  

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }, 100); // Ajusta el timeout si es necesario
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  async openCameraComponent() {
    const modal = await this.modalController.create({
        component: CamaraComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
        this.sendMessage(data);
    }
}
}
