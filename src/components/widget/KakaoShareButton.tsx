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
      size="sm"
      className="bg-[#FEE500] text-black font-semibold hover:bg-[#FDD835] border-none"
    >
      {label}
    </Button>
  );
}
