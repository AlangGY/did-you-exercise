export interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {title && <h1 className="text-xl font-bold text-gray-800">{title}</h1>}
      {children}
    </div>
  );
}
