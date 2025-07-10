import { Button } from "@/components/ui/button";

interface KakaoShareButtonProps {
  onClick: () => void;
  label?: string;
}

export function KakaoShareButton({
  onClick,
  label = "카카오톡으로 공유하기",
}: KakaoShareButtonProps) {
  return (
    <Button
      id="kakao-share-button"
      type="button"
      onClick={onClick}
      className="w-full py-2 rounded bg-[#FEE500] text-black font-semibold mb-2 border border-[#FEE500] hover:bg-[#ffe066] transition-colors"
    >
      {label}
    </Button>
  );
}
