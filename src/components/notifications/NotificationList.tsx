
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getUserNotifications, markNotificationAsRead } from '@/services/userService';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'event_registration' | 'system' | 'reminder';
  read: boolean;
  created_at: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserNotifications();
    setNotifications(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchNotifications();
  }, [user]);
  
  const handleReadNotification = async (id: string) => {
    if (await markNotificationAsRead(id)) {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer",
                  !notification.read && "bg-muted/40"
                )}
                onClick={() => handleReadNotification(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">
                    {notification.type === 'event_registration' && 'Event Registration'}
                    {notification.type === 'system' && 'System Notice'}
                    {notification.type === 'reminder' && 'Reminder'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationList;
