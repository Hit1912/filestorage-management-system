import { Loader2, Mail, UserIcon, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTypedSelector } from "@/app/hook";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/features/user/userAPI";
import { useDispatch } from "react-redux";
import { updateCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Account = () => {
  const dispatch = useDispatch();
  const { user } = useTypedSelector((store) => store.auth);
  const [name, setName] = useState(user?.name || "");

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const response = await updateUser({ name }).unwrap();
      dispatch(updateCredentials({ user: response.user }));
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-bold tracking-tight">
          Account Settings
        </CardTitle>
        <CardDescription className="text-base">
          Manage your personal information and how others see you on the
          platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-8">
        {/* Profile Preview Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-secondary/30 border border-border/50">
          <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
            <AvatarImage src={user?.profilePicture} alt={name} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="text-lg font-semibold">{name || "Your Name"}</h4>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified Account
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Form Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold">
                Display Name
              </Label>
              <div className="relative group">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary transition-all"
                />
              </div>
              <p className="text-[12px] text-muted-foreground px-1">
                This is the name that will be displayed on your profile and
                files.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  defaultValue={user?.email || "Unknown"}
                  readOnly
                  disabled
                  className="pl-10 h-11 bg-muted/30 border-dashed border-border/40 cursor-not-allowed opacity-80"
                />
              </div>
              <p className="text-[12px] text-muted-foreground px-1">
                Your email address is managed by your account provider.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border/40">
            <Button
              onClick={handleSave}
              disabled={isLoading || name === user?.name}
              className="h-11 px-8 font-semibold shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Account;


