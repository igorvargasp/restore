"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(7, {
      message: "Password must be at least 7 characters",
    })
    .max(12, {
      message: "Password cannot exceed 12 characters",
    }),
});

export function LoginAccountForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClientComponentClient();
      const { email, password } = values;
      const {
        error,
        data: { session },
      } = await supabase.auth.signInWithPassword({ email, password });

      form.reset();
      router.refresh();
    } catch (error) {
      console.log("login-form", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormDescription>This is your E-mail </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormDescription>This is your password </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
