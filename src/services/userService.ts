
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface UserProfileData {
  full_name?: string;
  avatar_url?: string;
  user_type?: 'attendee' | 'organizer';
}

export const updateUserProfile = async (profileData: UserProfileData) => {
  try {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: profileData
    });

    if (error) {
      throw error;
    }

    return user;
  } catch (error: any) {
    toast({
      title: "Profile Update Failed",
      description: error.message || "An error occurred while updating your profile",
      variant: "destructive",
    });
    throw error;
  }
};

export const getUserNotifications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};
