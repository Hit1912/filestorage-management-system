import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useLoginMutation } from "@/features/auth/authAPI";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import { Loader, Github } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const SignInForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    login(values)
      .unwrap()
      .then((data) => {
        dispatch(setCredentials(data));
        toast.success("Login successful");
        setTimeout(() => {
          navigate(PROTECTED_ROUTES.OVERVIEW);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data?.message || "Failed to login");
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6 w-full", className)}
        {...props}
      >
        <div className="flex flex-col items-start gap-1.5 text-left mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Login to your account</h1>
          <p className="text-balance text-base text-muted-foreground">
            Enter your email below to login to your account.
          </p>
        </div>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="h-11 px-4 rounded-lg bg-background/50 focus-visible:ring-primary/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <Link to="#" className="text-xs font-medium text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password" 
                      className="h-11 px-4 rounded-lg bg-background/50 focus-visible:ring-primary/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit" className="w-full h-11 mt-2 text-base font-medium rounded-lg shadow-sm">
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border my-2">
            <span className="relative z-10 bg-[var(--bg-color)] dark:bg-background px-3 text-muted-foreground text-xs uppercase tracking-wider font-medium">
              Or continue with
            </span>
          </div>
          
          <Button type="button" variant="outline" className="w-full h-11 bg-transparent hover:bg-muted/50 rounded-lg">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_UP}
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
