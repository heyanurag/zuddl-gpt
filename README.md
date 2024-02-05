# zuddlGPT

Knowledge base data scraper here - [zuddl-gpt-crawler](https://github.com/heyanurag/zuddl-gpt-crawler)

https://github.com/heyanurag/zuddl-gpt/assets/63957920/b2cc9fc1-cb1c-4e6c-870d-562a267791ba

ChatGPT powered search for Zuddl's knowledge base.

## features

1. API response streaming with server sent events.
2. IP based rate limiting middleware using sliding window technique.
3. Responds with related articles from knowledge base apart from the bot's custom response.
4. env variables validation with zod schema.

## usage

- Clone the repository.
- Create a `.env` file with content similar to `.env.example` (use your own API keys).
- Install dependencies with the command `yarn`.
- Run the project with the command `yarn dev`.

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
