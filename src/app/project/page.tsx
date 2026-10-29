import type { Metadata } from "next";
import { ProjectSite } from "@/components/project/ProjectSite";

export const metadata: Metadata = {
  title: "板橋文化段捷運聯開都更案｜工程公開資訊",
  description:
    "供主管機關與居民查閱的都更、捷運聯開案公開頁：基地資料、大事記、規劃圖說、工地畫面、施工照片、工期與說明會簡報。",
};

export default function ProjectPage() {
  return <ProjectSite />;
}
