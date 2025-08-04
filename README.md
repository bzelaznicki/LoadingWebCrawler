# LoadingWebCrawler

A **fast Deno + Playwright** crawler for JavaScript‑rendered sites with real‑time stats and `robots.txt` support.

## Quick Start
```bash
git clone https://github.com/bzelaznicki/LoadingWebCrawler.git
cd LoadingWebCrawler
deno task playwright:install
deno task start https://example.com --concurrency 10 --rps 2 --fast
```

## Run Modes
- **start**: `deno task start <url>` – Production crawl  
- **dev**: `deno task dev <url>` – Dev mode with file watching  
- **manual**: `deno run --allow-all main.ts <url>` – Direct run  

## Options
- `--concurrency N` – Workers (default: 5)  
- `--rps N` – Requests/sec per worker (default: 1)  
- `--fast` – Ignore crawl‑delay  
- `--ignore-robots` – Ignore robots.txt  

**Features:** Concurrent crawling, JS rendering, rate‑limiting, resource blocking, same‑origin filtering.  
**Output:** Live stats + JSON URLs.  

[MIT](LICENSE)
