
export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.requestPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async requestPermission(): Promise<void> {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  public async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (this.permission === 'granted' && 'Notification' in window) {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  }

  public async notifyBugAssignment(bugTitle: string, assigneeName: string): Promise<void> {
    await this.showNotification('New Bug Assigned', {
      body: `${bugTitle} has been assigned to ${assigneeName}`,
      tag: 'bug-assignment',
    });
  }

  public async notifyDueBug(bugTitle: string): Promise<void> {
    await this.showNotification('Bug Due Soon', {
      body: `${bugTitle} is due soon`,
      tag: 'bug-due',
    });
  }

  public async notifyStatusChange(bugTitle: string, newStatus: string): Promise<void> {
    await this.showNotification('Bug Status Changed', {
      body: `${bugTitle} status changed to ${newStatus}`,
      tag: 'status-change',
    });
  }
}

export const notificationService = NotificationService.getInstance();
