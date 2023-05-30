import { type IPassage } from "./types";

export const Passage = ({ chunk }: IPassage) => {
    const title_array = chunk.article_title.split(":");
    const title = title_array.slice(0, -1).join(":");

    return (
        <div className="mb-6 relative w-full bg-white shadow-md rounded-lg border border-black">
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600">{chunk.content}</p>
            </div>
            <a
                href={chunk.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </a>
        </div>
    );
}