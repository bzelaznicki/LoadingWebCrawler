# LoadingWebCrawler

A high-performance web crawler built with Deno and Playwright that executes JavaScript and respects robots.txt while providing real-time crawling statistics.

## Features

- 🚀 **High Performance**: Concurrent crawling with configurable worker pools
- ⚡ **JavaScript Execution**: Fully renders pages with JavaScript, capturing dynamically generated content
- 🤖 **Robots.txt Compliance**: Automatically parses and respects robots.txt rules
- 📊 **Real-time Statistics**: Live progress tracking with pages/second metrics
- 🎭 **Playwright Integration**: Uses Playwright for reliable page rendering and JS execution
- ⚡ **Optimized Loading**: Blocks unnecessary resources (images, CSS, fonts) for faster crawling
- 🔧 **Configurable Rate Limiting**: Customizable requests per second to be respectful to target sites
- 🌐 **Same-origin Crawling**: Automatically stays within the target domain

## Prerequisites

- [Deno](https://deno.land/) 2.0 or higher
- Playwright browsers (installed automatically via setup)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bzelaznicki/LoadingWebCrawler.git
cd LoadingWebCrawler
```

2. Install Playwright browsers:
```bash
deno task playwright:install
```

## Usage

### Basic Usage

```bash
deno run --allow-all main.ts <url>
```

### Examples

```bash
# Crawl a website
deno run --allow-all main.ts https://example.com

# Using the dev task (with file watching)
deno task dev https://example.com
```

### Output

The crawler will display real-time progress:
```
Crawler starting on https://example.com...

Visited: 25 | Queue: 12 | Speed: 3.45 pages/sec
```

After completion, it outputs a JSON array of all discovered URLs:
```json
[
  "https://example.com/",
  "https://example.com/about",
  "https://example.com/contact",
  ...
]
```

## Configuration

The crawler can be configured by modifying the parameters in `main.ts`:

```typescript
const links = await crawlLinks(
  baseURL,     // Starting URL
  5,           // Concurrency (number of parallel workers)
  1,           // Max requests per second per worker
  onProgress,  // Progress callback function
  false        // Fast mode (ignores crawl-delay from robots.txt)
);
```

### Parameters

- **concurrency**: Number of parallel browser contexts (default: 5)
- **maxRPS**: Maximum requests per second per worker (default: 1)
- **fastMode**: When `true`, ignores crawl-delay from robots.txt (default: false)

## How It Works

1. **JavaScript Execution**: Uses a real browser engine to execute JavaScript and capture dynamically generated content
2. **Robots.txt Parsing**: Downloads and parses robots.txt to respect disallowed paths and crawl delays
3. **Concurrent Workers**: Spawns multiple browser contexts for parallel processing
4. **Rate Limiting**: Implements per-worker rate limiting to avoid overwhelming target servers
5. **Resource Blocking**: Blocks images, stylesheets, and fonts to speed up page loading while preserving JS execution
6. **Same-origin Filtering**: Only follows links within the same domain as the starting URL
7. **Real-time Progress**: Provides live statistics during crawling

## Technical Details

### Dependencies

- **Playwright**: For browser automation, JavaScript execution, and reliable page rendering
- **Deno Standard Library**: For core utilities

### Architecture

The crawler uses a worker pool pattern where each worker:
- Maintains its own browser context
- Processes URLs from a shared queue
- Respects rate limits and robots.txt rules
- Extracts and normalizes links from each page

### Performance Optimizations

- Resource blocking for faster page loads
- Configurable concurrency levels
- Rate limiting to balance speed and politeness
- DOM content loaded waiting (faster than full page load)

## Development

### Available Tasks

```bash
# Run with file watching
deno task dev <url>

# Install Playwright browsers
deno task playwright:install
```

### Project Structure

```
├── main.ts          # Entry point and argument parsing
├── crawler.ts       # Core crawling logic
├── deno.json       # Deno configuration and tasks
├── deno.lock       # Dependency lock file
└── README.md       # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Deno](https://deno.land/) runtime
- Powered by [Playwright](https://playwright.dev/) for browser automation
- Respects web crawling best practices and robots.txt standards
