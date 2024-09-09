import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Desktop from "../components/Desktop";

export default function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <Desktop />;
}
