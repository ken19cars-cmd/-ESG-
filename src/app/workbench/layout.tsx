import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "翰欣科技 ESG 計算系統",
  description: "寫入永續報告書所需活動數據，依 GRI／金管會規則交叉計算指標。",
};

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="wb-root">{children}</div>;
}
