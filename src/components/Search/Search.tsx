import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { type ISearchForm } from "./types";

export const SearchForm = ({ query, setQuery, handleSearch, isDisabled }: ISearchForm) => {
    return (
        <form className="relative w-full mb-4" onSubmit={handleSearch}>
            <SearchIcon className="absolute left-1 top-3 h-6 w-10 rounded-full opacity-90 sm:left-3 sm:top-4 sm:h-8" />

            <input
                className="h-12 w-full rounded-full border border-zinc-600 pl-11 pr-12 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pl-16 sm:pr-16 sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="text"
                placeholder="How do I add a virtual background?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                disabled={isDisabled}
            />

            <button disabled={isDisabled} type="submit" className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-primary p-1 text-white hover:cursor-pointer hover:opacity-80 sm:right-3 sm:top-3 sm:h-10 sm:w-10 disabled:opacity-60 disabled:cursor-not-allowed">
                <ArrowRightIcon size={30} />
            </button>
        </form>
    );
}