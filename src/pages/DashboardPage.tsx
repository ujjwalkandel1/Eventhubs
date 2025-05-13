
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Plus, Loader2, BellRing } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserEvents } from '@/services/eventService';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import ProfileEditForm from '@/components/user/ProfileEditForm';
import NotificationList from '@/components/notifications/NotificationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserNotifications } from '@/services/userService';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/dashboard' } });
    }
  }, [user, navigate]);
  
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['userEvents'],
    queryFn: getUserEvents,
    enabled: !!user,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: getUserNotifications,
    enabled: !!user,
  });
  
  const unreadNotifications = notifications.filter((notification: any) => !notification.read);
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-event to-event-dark bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/create" className="flex items-center gap-2">
              <Plus size={16} />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="events" className="flex-1">My Events</TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">
                Notifications
                {unreadNotifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadNotifications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>My Events</CardTitle>
                  <CardDescription>Events you've created</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : isError ? (
                    <p className="text-destructive">
                      Error loading your events. Please try again.
                    </p>
                  ) : events && events.length > 0 ? (
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="border rounded-md p-3 hover:bg-muted transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium line-clamp-1">{event.title}</h4>
                            <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                              <Link to={`/events/${event.id}/edit`}>
                                <Edit className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(event.date), 'MMM d, yyyy')}
                          </div>
                        </div>
                      ))}
                      
                      {events.length > 5 && (
                        <Button variant="link" className="w-full" asChild>
                          <Link to="/dashboard/events">View All Events</Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        You haven't created any events yet.
                      </p>
                      <Button asChild>
                        <Link to="/create">Create Your First Event</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BellRing className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Your recent notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        You don't have any notifications yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification: any) => (
                        <div 
                          key={notification.id}
                          className={`p-3 border rounded-md ${!notification.read ? 'bg-muted/40' : ''}`}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {notification.type === 'event_registration' && 'Event Registration'}
                              {notification.type === 'system' && 'System Notice'}
                              {notification.type === 'reminder' && 'Reminder'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
