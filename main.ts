import { crawlLinks } from "./crawler.ts";

async function main() {
  const args = Deno.args;

  if (args.length !== 1) {
    console.error("Usage: deno run --allow-all main.ts <url>");
    Deno.exit(1);
  }

  const baseURL = args[0];
  try {
    new URL(baseURL);
  } catch {
    console.error("Error: Invalid URL");
    Deno.exit(1);
  }

  console.log(`Crawler starting on ${baseURL}...\n`);

  try {
    const links = await crawlLinks(baseURL, 5, 1, (stats) => {
      Deno.stdout.write(
        new TextEncoder().encode(
          `\rVisited: ${stats.visited} | Queue: ${stats.queued} | Speed: ${stats.perSecond} pages/sec`,
        ),
      );
    });

    console.log("\n\nCrawl finished!");
    console.log(JSON.stringify(links, null, 2));
    Deno.exit(0);
  } catch (err) {
    console.error(`Error fetching ${baseURL}: ${(err as Error).message}`);
    Deno.exit(1);
  }
}

main();
