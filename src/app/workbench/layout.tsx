import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESG 工作底稿｜衡澄",
  description: "會計師寫入年度數據，依 GRI／金管會規則交叉計算 ESG 指標。",
};

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="wb-root">{children}</div>;
}
