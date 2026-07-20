import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StaffRole } from '../../../core/models/portal.models';
import { ChatMode, TeamChatMessage, TeamChatService } from '../../../core/services/team-chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy{
  @ViewChild('chatBody') chatBody?: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  role: StaffRole | null = null;
  messageText = '';
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    public chat: TeamChatService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.chat.initForRole(this.role);
    this.refreshTimer = setInterval(() => {
      this.role = this.auth.getRole();
      this.chat.initForRole(this.role);
      this.cdr.markForCheck();
    }, 1400);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  get channels() {
    return this.chat.getChannels(this.role);
  }

  get activeChannel() {
    return this.chat.getActiveChannel(this.role);
  }

  get messages(): TeamChatMessage[] {
    return this.chat.getMessages(this.chat.activeChatId);
  }

  get call() {
    return this.chat.getCall(this.chat.activeChatId);
  }

  get showCallBar(): boolean {
    return !!this.call.type && this.call.state !== 'ended';
  }

  get pageTitle(): string {
    return this.role === 'technician' ? 'Chat Agent' : 'Team Chat';
  }

  get pageSubtitle(): string {
    if (this.role === 'technician') return 'Message dispatch agents and customers';
    return 'Internal coordination and technician communication hub';
  }

  switchMode(mode: ChatMode): void {
    this.chat.switchMode(mode, this.role);
  }

  openChat(chatId: string): void {
    if (chatId === 'ch-tech-empty') return;
    this.chat.openChat(chatId);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;
    this.chat.sendMessage(this.messageText, this.role);
    this.messageText = '';
    setTimeout(() => {
      this.scrollToBottom();
      this.cdr.markForCheck();
    }, 100);
    setTimeout(() => this.cdr.markForCheck(), 800);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.chat.uploadDocument(file.name);
    input.value = '';
    this.toast.show(`Uploaded ${file.name}`);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  async toggleVoiceNote(): Promise<void> {
    const result = await this.chat.toggleVoiceNote();
    if (result === 'unsupported') this.toast.show('Voice notes not supported in this browser.', 'error');
    else if (result === 'denied') this.toast.show('Microphone access denied.', 'error');
    else if (result === 'started') this.toast.show('Recording voice note...');
    else if (result === 'stopped') {
      this.toast.show('Voice note sent.');
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  startAudioCall(): void {
    this.chat.startCall('audio', this.role);
    this.toast.show('Audio call ringing...');
  }

  startVideoCall(): void {
    this.chat.startCall('video', this.role);
    this.toast.show('Video call ringing...');
  }

  endCall(): void {
    this.chat.endCall();
    this.toast.show('Call ended.');
  }

  displayRole(message: TeamChatMessage): 'self' | 'other' {
    return this.chat.displayRole(message, this.chat.activeChatId);
  }

  receiptText(status: string): string {
    return this.chat.receiptText(status);
  }

  callLabel(): string {
    const state = this.call.state.charAt(0).toUpperCase() + this.call.state.slice(1);
    return `${state} ${this.call.type} call`;
  }

  callIcon(): string {
    return this.call.type === 'video' ? 'fa-video' : 'fa-phone';
  }

  private scrollToBottom(): void {
    const el = this.chatBody?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
