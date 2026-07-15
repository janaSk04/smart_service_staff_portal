import { Injectable } from '@angular/core';
import { StaffRole } from '../models/portal.models';
import { AuthService } from './auth.service';

export type ChatMode = 'internal' | 'external';
export type ChatMessageRole = 'self' | 'other' | 'user' | 'bot';
export type ChatMessageType = 'text' | 'document' | 'voice';
export type CallState = 'ringing' | 'connected' | 'ended';

export interface TeamChatChannel {
  id: string;
  title: string;
  subtitle: string;
  avatar: string;
  unread: number;
  participants: string[];
}

export interface TeamChatMessage {
  id: string;
  role: ChatMessageRole;
  sender: string;
  type: ChatMessageType;
  text: string;
  fileName?: string;
  time: string;
  status: 'sent' | 'delivered' | 'seen';
}

export interface TeamCall {
  state: CallState;
  type: 'audio' | 'video' | null;
  by?: string;
  startedAt?: number;
  updatedAt?: number;
  endedBy?: string;
}

const STORAGE_KEY = 'servex_team_chat_messages';
const CALLS_KEY = 'servex_team_chat_calls';

const CHANNELS: Record<ChatMode, TeamChatChannel[]> = {
  internal: [
    { id: 'ch-admin-team', title: 'Admin Team', subtitle: 'Admin + Agents + Dispatch', avatar: 'AT', unread: 2, participants: ['Arjun Perera', 'Nadeesha Silva', 'Dispatch Bot'] },
    { id: 'ch-ops-war', title: 'Ops War Room', subtitle: 'Critical escalations', avatar: 'OW', unread: 1, participants: ['Arjun Perera', 'Kasun Perera', 'Nadeesha Silva'] },
    { id: 'ch-agents', title: 'Agent Coordination', subtitle: 'Daily allocation updates', avatar: 'AC', unread: 0, participants: ['Nadeesha Silva', 'Kasun Perera', 'Dimali W.'] },
  ],
  external: [
    { id: 'ch-tech-roshan', title: 'Roshan Fernando', subtitle: 'Technician · Zone 1', avatar: 'RF', unread: 1, participants: ['Roshan Fernando', 'Arjun Perera'] },
    { id: 'ch-tech-amal', title: 'Amal Wickrama', subtitle: 'Technician · Plumbing', avatar: 'AW', unread: 0, participants: ['Amal Wickrama', 'Nadeesha Silva'] },
    { id: 'ch-tech-chamara', title: 'Chamara Tissa', subtitle: 'Technician · Cleaning', avatar: 'CT', unread: 0, participants: ['Chamara Tissa', 'Nadeesha Silva'] },
  ],
};

const SEED_MESSAGES: Record<string, TeamChatMessage[]> = {
  'ch-admin-team': [
    { id: 'm1', role: 'other', sender: 'Nadeesha', type: 'text', text: 'REQ-0342 marked critical. Need fast dispatch.', time: '09:12', status: 'delivered' },
    { id: 'm2', role: 'self', sender: 'You', type: 'text', text: 'Assign Amal and escalate to priority lane.', time: '09:14', status: 'seen' },
  ],
  'ch-ops-war': [
    { id: 'm3', role: 'other', sender: 'Dispatch Bot', type: 'text', text: 'SLA warning: 3 requests close to breach.', time: '08:59', status: 'delivered' },
  ],
  'ch-agents': [
    { id: 'm4', role: 'other', sender: 'Kasun', type: 'text', text: 'Zone 2 completed 12 pickups.', time: 'Yesterday', status: 'seen' },
  ],
  'ch-tech-roshan': [
    { id: 'm5', role: 'other', sender: 'Roshan', type: 'text', text: 'Traffic near baseline road, ETA +10 mins.', time: '10:03', status: 'delivered' },
    { id: 'm6', role: 'self', sender: 'You', type: 'text', text: 'Noted. Update customer and continue.', time: '10:04', status: 'seen' },
  ],
  'ch-tech-amal': [
    { id: 'm7', role: 'other', sender: 'Amal', type: 'text', text: 'Need extra fittings for REQ-0338.', time: '09:40', status: 'delivered' },
  ],
  'ch-tech-chamara': [
    { id: 'm8', role: 'other', sender: 'Chamara', type: 'text', text: 'Deep cleaning completed. Uploading photos.', time: '08:22', status: 'seen' },
  ],
  'ch-tech-internal': [
    { id: 'm9', role: 'other', sender: 'Nadeesha Silva', type: 'text', text: 'Roshan, customer on REQ-0341 asked for ETA update.', time: '10:18', status: 'delivered' },
    { id: 'm10', role: 'self', sender: 'You', type: 'text', text: 'On my way — arriving in 8 minutes.', time: '10:19', status: 'seen' },
  ],
  'REQ-2026-0341': [
    { id: 'm11', role: 'user', sender: 'Priya Mendis', type: 'text', text: 'Hi, are you on the way for garbage collection?', time: '10:05', status: 'delivered' },
    { id: 'm12', role: 'bot', sender: 'You', type: 'text', text: 'Yes, I am en route. ETA 10:20 AM.', time: '10:06', status: 'seen' },
  ],
  'REQ-2026-0338': [
    { id: 'm13', role: 'user', sender: 'Kamal Silva', type: 'text', text: 'Please bring spare washers if possible.', time: '09:50', status: 'delivered' },
    { id: 'm14', role: 'bot', sender: 'You', type: 'text', text: 'Will do. I have fittings in the van.', time: '09:52', status: 'seen' },
  ],
};

@Injectable({
  providedIn: 'root'
})
export class TeamChatService {
  mode: ChatMode = 'internal';
  activeChatId: string | null = null;
  recordingVoiceNote = false;
  private techInitialized = false;
  private mediaRecorder: MediaRecorder | null = null;
  private voiceChunks: Blob[] = [];
  private callTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private auth: AuthService) {}

  initForRole(role: StaffRole | null): void {
    if (role === 'technician' && !this.techInitialized) {
      this.mode = 'external';
      this.techInitialized = true;
      this.seedTechnicianThreads();
    }
    const channels = this.getChannels(role);
    if (!this.activeChatId || !channels.some((c) => c.id === this.activeChatId)) {
      this.activeChatId = channels[0]?.id ?? null;
    }
  }

  private seedTechnicianThreads(): void {
    const store = this.readStore();
    if (!store['REQ-2026-0341']) store['REQ-2026-0341'] = [...SEED_MESSAGES['REQ-2026-0341']];
    if (!store['REQ-2026-0338']) store['REQ-2026-0338'] = [...SEED_MESSAGES['REQ-2026-0338']];
    if (!store['ch-tech-internal']) store['ch-tech-internal'] = [...SEED_MESSAGES['ch-tech-internal']];
    this.writeStore(store);
  }

  getChannels(role: StaffRole | null): TeamChatChannel[] {
    if (role === 'technician') {
      if (this.mode === 'internal') {
        return [
          { id: 'ch-tech-internal', title: 'Agent Desk', subtitle: 'Internal with dispatch/agents', avatar: 'AD', unread: 0, participants: ['Nadeesha Silva', 'Dispatch Team'] },
        ];
      }
      const store = this.readStore();
      const requestIds = Object.keys(store).filter((k) => /^REQ-\d{4}-\d+$/i.test(k));
      if (!requestIds.length) {
        return [{ id: 'ch-tech-empty', title: 'No Customer Chats', subtitle: 'Customer requests will appear here', avatar: 'NC', unread: 0, participants: ['Technician'] }];
      }
      return requestIds.map((id) => {
        const messages = (store[id] || []).map((m) => this.normalize(m));
        const unread = messages.filter((m) => m.role === 'user' && m.status !== 'seen').length;
        return {
          id,
          title: `Customer · ${id}`,
          subtitle: 'Live service conversation',
          avatar: 'CU',
          unread,
          participants: ['Customer', this.auth.getUser()?.name || 'Technician'],
        };
      });
    }
    return CHANNELS[this.mode];
  }

  getActiveChannel(role: StaffRole | null): TeamChatChannel | null {
    const channels = this.getChannels(role);
    return channels.find((c) => c.id === this.activeChatId) ?? channels[0] ?? null;
  }

  getMessages(chatId: string | null): TeamChatMessage[] {
    if (!chatId) return [];
    const store = this.readStore();
    const seeded = { ...SEED_MESSAGES, ...store };
    return (seeded[chatId] || []).map((m) => this.normalize(m));
  }

  switchMode(mode: ChatMode, role: StaffRole | null): void {
    this.mode = mode;
    this.activeChatId = null;
    this.initForRole(role);
  }

  openChat(chatId: string): void {
    this.activeChatId = chatId;
  }

  sendMessage(text: string, role: StaffRole | null): void {
    if (!text.trim() || !this.activeChatId) return;
    const chatId = this.activeChatId;
    const store = this.readStore();
    store[chatId] ||= [];
    const requestThread = this.isRequestThread(chatId);
    store[chatId].push({
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      role: requestThread ? 'bot' : 'self',
      sender: this.auth.getUser()?.name || 'You',
      type: 'text',
      text: text.trim(),
      time: this.nowShortTime(),
      status: 'sent',
    });
    this.writeStore(store);

    setTimeout(() => {
      const refreshed = this.readStore();
      refreshed[chatId] ||= [];
      refreshed[chatId].push({
        id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
        role: requestThread ? 'user' : 'other',
        sender: this.mode === 'internal' ? 'Team' : requestThread ? 'Customer' : 'Technician',
        type: 'text',
        text: this.mode === 'internal' ? 'Acknowledged. Actioning now.' : requestThread ? 'Thank you!' : 'Received. I will update in 5 minutes.',
        time: this.nowShortTime(),
        status: 'delivered',
      });
      this.writeStore(refreshed);
    }, 700);
  }

  uploadDocument(fileName: string): void {
    if (!this.activeChatId) return;
    const chatId = this.activeChatId;
    const store = this.readStore();
    store[chatId] ||= [];
    const requestThread = this.isRequestThread(chatId);
    store[chatId].push({
      id: `msg-${Date.now()}`,
      role: requestThread ? 'bot' : 'self',
      sender: this.auth.getUser()?.name || 'You',
      type: 'document',
      fileName,
      text: `Document: ${fileName}`,
      time: this.nowShortTime(),
      status: 'sent',
    });
    this.writeStore(store);
  }

  async toggleVoiceNote(): Promise<'started' | 'stopped' | 'unsupported' | 'denied'> {
    if (this.recordingVoiceNote) {
      this.mediaRecorder?.stop();
      return 'stopped';
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      return 'unsupported';
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.voiceChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.recordingVoiceNote = true;
      this.mediaRecorder.ondataavailable = (e) => this.voiceChunks.push(e.data);
      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        this.recordingVoiceNote = false;
        if (this.activeChatId) {
          const store = this.readStore();
          const chatId = this.activeChatId;
          store[chatId] ||= [];
          const requestThread = this.isRequestThread(chatId);
          store[chatId].push({
            id: `msg-${Date.now()}`,
            role: requestThread ? 'bot' : 'self',
            sender: this.auth.getUser()?.name || 'You',
            type: 'voice',
            text: `Voice note (${Math.max(1, Math.round(this.voiceChunks.length / 2))}s)`,
            time: this.nowShortTime(),
            status: 'sent',
          });
          this.writeStore(store);
        }
      };
      this.mediaRecorder.start();
      return 'started';
    } catch {
      return 'denied';
    }
  }

  getCall(chatId: string | null): TeamCall {
    if (!chatId) return { state: 'ended', type: null };
    const calls = this.readCalls();
    return calls[chatId] || { state: 'ended', type: null };
  }

  startCall(type: 'audio' | 'video', role: StaffRole | null): void {
    if (!this.activeChatId) return;
    const chatId = this.activeChatId;
    const calls = this.readCalls();
    calls[chatId] = { state: 'ringing', type, by: role || 'staff', startedAt: Date.now(), updatedAt: Date.now() };
    this.writeCalls(calls);
    if (this.callTimer) clearTimeout(this.callTimer);
    this.callTimer = setTimeout(() => {
      const latest = this.readCalls();
      if (latest[chatId]?.state === 'ringing') {
        latest[chatId].state = 'connected';
        latest[chatId].updatedAt = Date.now();
        this.writeCalls(latest);
      }
    }, 1800);
  }

  endCall(): void {
    if (!this.activeChatId) return;
    const chatId = this.activeChatId;
    const calls = this.readCalls();
    calls[chatId] = { ...(calls[chatId] || {}), state: 'ended', endedBy: this.auth.getRole() || 'staff', updatedAt: Date.now() };
    this.writeCalls(calls);
    if (this.callTimer) clearTimeout(this.callTimer);
  }

  displayRole(message: TeamChatMessage, chatId: string | null): 'self' | 'other' {
    if (this.isRequestThread(chatId)) {
      return message.role === 'bot' ? 'self' : 'other';
    }
    return message.role === 'self' ? 'self' : 'other';
  }

  receiptText(status: string): string {
    if (status === 'seen') return 'Seen';
    if (status === 'delivered') return 'Delivered';
    return 'Sent';
  }

  channelSubtitle(role: StaffRole | null): string {
    if (this.mode === 'internal') return 'Internal channel';
    if (role === 'technician') return 'Customer request channel';
    return 'External technician line';
  }

  modeLabelB(role: StaffRole | null): string {
    return role === 'technician' ? 'Customers' : 'Technicians';
  }

  modeIconB(role: StaffRole | null): string {
    return role === 'technician' ? 'fa-user' : 'fa-user-helmet-safety';
  }

  private isRequestThread(chatId: string | null): boolean {
    return /^REQ-\d{4}-\d+$/i.test(String(chatId || ''));
  }

  private normalize(message: Partial<TeamChatMessage>): TeamChatMessage {
    return {
      id: message.id || `msg-${Date.now()}`,
      role: message.role || 'other',
      sender: message.sender || 'Unknown',
      type: message.type || 'text',
      text: message.text || '',
      fileName: message.fileName,
      time: message.time || this.nowShortTime(),
      status: message.status || 'sent',
    };
  }

  private readStore(): Record<string, TeamChatMessage[]> {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { ...SEED_MESSAGES, ...raw };
    } catch {
      return { ...SEED_MESSAGES };
    }
  }

  private writeStore(data: Record<string, TeamChatMessage[]>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private readCalls(): Record<string, TeamCall> {
    try {
      return JSON.parse(localStorage.getItem(CALLS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  private writeCalls(data: Record<string, TeamCall>): void {
    localStorage.setItem(CALLS_KEY, JSON.stringify(data));
  }

  private nowShortTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
