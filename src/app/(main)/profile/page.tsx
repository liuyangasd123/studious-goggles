
import Image from 'next/image';
import { AccountBalance } from "@/components/profile/AccountBalance";
import { OrderHistoryTable } from "@/components/profile/OrderHistoryTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit3, Shield, Bell, KeyRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 relative h-[200px]">
           <Image src="https://placehold.co/1200x200.png" alt="Profile banner" layout="fill" objectFit="cover" className="opacity-30" data-ai-hint="abstract banner" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src="https://placehold.co/128x128.png" alt="User Avatar" data-ai-hint="user portrait" />
              <AvatarFallback className="text-4xl">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-headline font-bold">John Doe</h1>
              <p className="text-lg text-muted-foreground">john.doe@example.com</p>
              <p className="text-sm text-primary">UID: 123456789</p>
            </div>
            <Button variant="outline" className="md:ml-auto mt-4 md:mt-0">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <AccountBalance />
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <Shield className="h-5 w-5 text-primary" /> Security Settings
                </Button>
                 <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <KeyRound className="h-5 w-5 text-primary" /> API Keys
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <Bell className="h-5 w-5 text-primary" /> Notification Preferences
                </Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <OrderHistoryTable />
        </div>
      </div>
    </div>
  );
}
