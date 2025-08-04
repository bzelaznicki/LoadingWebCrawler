# LoadingWebCrawler

A **fast Deno + Playwright** crawler that executes JavaScript, respects `robots.txt`, and shows real‑time stats.

## Quick Start

Clone & run:
```bash
git clone https://github.com/bzelaznicki/LoadingWebCrawler.git
cd LoadingWebCrawler
deno task playwright:install
deno run --allow-all main.ts https://example.com --concurrency 10 --rps 2 --fast
```

## CLI Options

- `--concurrency N` – Number of parallel workers (default: 5)
- `--rps N` – Requests per second per worker (default: 1)
- `--fast` – Ignore crawl‑delay from robots.txt
- `--ignore-robots` – Completely ignore robots.txt rules

**Features:** Concurrent crawling, rate‑limiting, JS rendering, resource blocking, same‑origin filtering.  
**Output:** Live stats + JSON of discovered URLs.  

[MIT](LICENSE)
