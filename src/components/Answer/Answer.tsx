import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type IAnswer } from "./types";

export const Answer = ({ answer }: IAnswer) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            linkTarget="_blank"
            className="prose w-full self-start"
        >
            {answer}
        </ReactMarkdown>
    );
}