export interface NotificationTemplate {
    id: string | null;
    title: string;
    body: string;
    receiverId: string;
    bump: boolean;
    createdAt: Date;
    read : boolean;
}
