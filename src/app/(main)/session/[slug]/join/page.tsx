import { JoinSessionScreen } from "@/components/screen/JoinSessionScreen";

export default async function JoinSessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sessionId = parseInt(slug);
  return <JoinSessionScreen sessionId={sessionId} />;
}
