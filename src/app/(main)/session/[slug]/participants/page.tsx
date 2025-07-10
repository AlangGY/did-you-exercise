import { SessionParticipantsScreen } from "@/components/screen/SessionParticipantsScreen";

export default async function SessionParticipantsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ week?: string }>;
}) {
  const { slug } = await params;
  const { week } = await searchParams;
  const sessionId = parseInt(slug);

  return <SessionParticipantsScreen sessionId={sessionId} week={week} />;
}
