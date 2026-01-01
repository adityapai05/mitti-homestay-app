import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import CreateHomestayStepper from "./CreateHomestayStepper";
import { redirect } from "next/navigation";

export default async function CreateHomestayPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return <CreateHomestayStepper />;
}
