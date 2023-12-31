import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateAccountForm } from "@/components/create-account-form";
import { LoginAccountForm } from "@/components/login-account-form";

export default async function Home() {
  let loggedIn = false;

  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) loggedIn = true;
  } catch (error) {
    console.log("Home", error);
  } finally {
    if (loggedIn) redirect("/user-app", RedirectType.replace);
  }

  return (
    <main className="flex flex-col h-screen w-full justify-center items-center">
      <Tabs
        defaultValue="create-account"
        className="w-[400px] border rounded-sm pb-4 shadow-2xl"
      >
        <TabsList className="flex justify-around items-center rounded-b-none h-14">
          <TabsTrigger
            value="create-account"
            className="transition-all delay-150"
          >
            create account
          </TabsTrigger>
          <TabsTrigger value="Login" className="transition-all delay-150">
            Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-account">
          <CreateAccountForm />
        </TabsContent>
        <TabsContent value="Login">
          <LoginAccountForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}
