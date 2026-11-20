import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { WorkbenchApp } from "@/components/workbench/WorkbenchApp";
import { currentSession, readBoundCookie } from "@/lib/auth";
import { resolveBoundCase } from "@/lib/bound-case";
import { findMember, isPaid } from "@/lib/members";

async function WorkbenchGate() {
  await connection();
  const session = await currentSession();
  const member = session ? findMember(session.username) : null;
  if (!member) redirect("/login?next=/workbench");
  const boundCase = resolveBoundCase(member.username, await readBoundCookie());
  return (
    <WorkbenchApp
      member={{
        username: member.username,
        company: member.company,
        paid: isPaid(member),
        role: member.role,
      }}
      boundCase={boundCase}
    />
  );
}

export default function WorkbenchPage() {
  return (
    <Suspense fallback={<p className="p-4 text-[14px]">載入計算系統…</p>}>
      <WorkbenchGate />
    </Suspense>
  );
}
