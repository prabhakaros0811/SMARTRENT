import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell, Shield } from 'lucide-react';

export default function OwnerSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account and notification settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" /> Notifications
            </h3>
            <p className="text-muted-foreground">
              This section is under development. Soon you'll be able to manage your email and push notification preferences here.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" /> Security
            </h3>
            <p className="text-muted-foreground">
              This section is under development. Soon you'll be able to change your password and manage account security.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
