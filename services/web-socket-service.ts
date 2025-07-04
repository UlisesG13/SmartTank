import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

// Define the SensorMessage interface if not already defined elsewhere
export interface SensorMessage {
  // Define the expected properties, e.g.:
  // id: string;
  // value: number;
  // timestamp: string;
  // Add more fields as needed based on your backend data
  [key: string]: any;
}


const WS_URL = 'localhost'; // Backend WebSocket URL

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket: WebSocket | null = null;
  private messages$ = new Subject<SensorMessage>();
  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private reconnectInterval = 5000; // Retry every 5 seconds
  private reconnectTimer: any = null;
  private isManuallyClosed = false;

 constructor() {
    this.connect();
  }

  private connect(): void {
    if (typeof window === 'undefined') return; // Prevent SSR errors

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.isManuallyClosed = false;

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log('✅ WebSocket connected');
        this.connectionStatus$.next(true);
      };

      this.socket.onmessage = this.handleMessage.bind(this);

      this.socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.socket.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.handleClose();
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data: SensorMessage = JSON.parse(event.data);
      console.log('📩 Message received:', data);
      this.messages$.next(data);
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }

  private handleClose(): void {
    this.connectionStatus$.next(false);
    console.warn('⚠️ WebSocket closed');

    if (!this.isManuallyClosed) {
      console.log(`🔄 Attempting reconnection in ${this.reconnectInterval / 1000} seconds...`);
      this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  sendMessage(message: SensorMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ Could not send message: WebSocket not connected');
    }
  }

  getMessages(): Observable<SensorMessage> {
    return this.messages$.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  close(): void {
    this.isManuallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
  }

  ngOnDestroy(): void {
    this.close();
  }
}
