import { ShareButtonProps } from "@/types/main";

export const ShareButton = ({ title, description }: ShareButtonProps) => {
  const shareText = `${title} - ${description}`;

  return (
    <div className="space-x-4 font-semibold md:font-bold text-sm">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-800"
      >
        WhatsApp
      </a>

      {/* Facebook Messenger Share Button */}
      <a
        href={`https://m.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        Messenger
      </a>

      {/* Telegram Share Button */}
      <a
        href={`https://t.me/share/url?url=&text=${encodeURIComponent(
          shareText
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Telegram
      </a>
    </div>
  );
};
