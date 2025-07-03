import MainLayout from "@/components/layout/MainLayout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout key="main-layout">{children}</MainLayout>;
}
