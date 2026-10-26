import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CinematicSplash } from "@/components/ui/CinematicSplash";
import { PageTransitionWrapper } from "@/components/ui/PageTransitionWrapper";
import { getUiSettings } from "@/lib/data/ui-settings-store";
import { getCompanyInfo } from "@/lib/data/company-store";

export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uiSettings = getUiSettings();
  const companyInfo = getCompanyInfo();

  return (
    <>
      <CinematicSplash initialSettings={uiSettings} />
      <Header initialCompanyInfo={companyInfo} />
      <main className="flex-1 flex flex-col">
        <PageTransitionWrapper initialSettings={uiSettings}>
          {children}
        </PageTransitionWrapper>
      </main>
      <Footer companyInfo={companyInfo} />
    </>
  );
}
