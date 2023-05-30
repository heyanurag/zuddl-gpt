import { type IPassage } from "./types";
import { ExternalLinkIcon } from "lucide-react";

export const Passage = ({ chunk }: IPassage) => {
  const title_array = chunk.article_title.split(":");
  const title = title_array.slice(0, -1).join(":");

  return (
    <div className="relative mb-6 w-full rounded-lg border border-black bg-white shadow-md">
      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{chunk.content}</p>
      </div>
      <a
        href={chunk.article_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 text-gray-700 hover:text-gray-900"
      >
        <ExternalLinkIcon className="h-5 w-5" />
      </a>
    </div>
  );
};
