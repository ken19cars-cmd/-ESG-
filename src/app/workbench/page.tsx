import { connection } from "next/server";
import { redirect } from "next/navigation";
import { WorkbenchApp } from "@/components/workbench/WorkbenchApp";
import { currentSession } from "@/lib/auth";
import { findMember, isPaid } from "@/lib/members";

export default async function WorkbenchPage() {
  await connection();
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member) redirect("/login?next=/workbench");
  return (
    <WorkbenchApp
      member={{
        username: member.username,
        company: member.company,
        paid: isPaid(member),
        role: member.role,
      }}
    />
  );
}
