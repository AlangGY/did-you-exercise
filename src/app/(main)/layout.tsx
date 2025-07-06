import ClientAuthGuard from "@/components/layout/ClientAuthGuard";
import MainLayout from "@/components/layout/MainLayout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthGuard>
      <MainLayout key="main-layout">{children}</MainLayout>
    </ClientAuthGuard>
  );
}
