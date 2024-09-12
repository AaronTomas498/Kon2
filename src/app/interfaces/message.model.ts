export interface Message {
  id: string;
  text?: string;
  sender: string;
  timestamp: number;
  photo?: string;
  location?: {
    latitude: number;
    longitude: number;
  }; // Nueva propiedad de ubicación
}

