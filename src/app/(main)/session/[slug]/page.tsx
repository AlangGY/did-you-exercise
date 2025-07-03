import SessionDetailScreen from "@/components/screen/SessionDetailScreen";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sessionId = parseInt(slug);

  return <SessionDetailScreen sessionId={sessionId} />;
}
