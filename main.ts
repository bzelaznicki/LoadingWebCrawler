import { crawlLinks } from "./crawler.ts";
import { parseFlags } from "./parseFlags.ts";

async function main() {
  const { flags, positional } = parseFlags(Deno.args);

  if (positional.length !== 1) {
    console.error(
      "Usage: deno run --allow-all main.ts <url> [--concurrency N] [--rps N] [--fast] [--ignore-robots]",
    );
    Deno.exit(1);
  }

  const baseURL = positional[0];
  try {
    new URL(baseURL);
  } catch {
    console.error("Error: Invalid URL");
    Deno.exit(1);
  }

  const concurrency = parseInt(flags.concurrency as string) || 5;
  const rps = parseInt(flags.rps as string) || 1;
  const fastMode = Boolean(flags.fast);
  const ignoreRobots = Boolean(flags["ignore-robots"]);

  console.log(`Starting crawl:
  URL: ${baseURL}
  Concurrency: ${concurrency}
  RPS: ${rps}
  Fast Mode: ${fastMode}
  Ignore Robots: ${ignoreRobots}
  `);

  try {
    const links = await crawlLinks(
      baseURL,
      concurrency,
      rps,
      (stats) => {
        Deno.stdout.write(
          new TextEncoder().encode(
            `\rVisited: ${stats.visited} | Queue: ${stats.queued} | Speed: ${stats.perSecond} pages/sec`,
          ),
        );
      },
      fastMode,
      ignoreRobots,
    );

    console.log("\n\nCrawl finished!");
    console.log(JSON.stringify(links, null, 2));
    Deno.exit(0);
  } catch (err) {
    console.error(`Error fetching ${baseURL}: ${(err as Error).message}`);
    Deno.exit(1);
  }
}

main();
