import { chromium } from "npm:playwright";

export async function crawlLinks(
  startUrl: string,
  concurrency = 5,
  maxRPS = 1,
  onProgress?: (
    stats: { visited: number; queued: number; perSecond: number },
  ) => void,
  fastMode = false,
  ignoreRobots = false,
) {
  const { disallowed, crawlDelay } = ignoreRobots
    ? { disallowed: [], crawlDelay: 0 }
    : await getRobotsConfig(startUrl);
  const visited = new Set<string>();
  const queue: string[] = [startUrl];
  const limiter = createLimiter(maxRPS * concurrency);

  let pagesCrawled = 0;
  const startTime = Date.now();

  function isAllowed(url: string) {
    if (ignoreRobots) return true;
    const path = new URL(url).pathname;
    return !disallowed.some((rule) => path.startsWith(rule));
  }

  const browser = await chromium.launch({ headless: true });

  async function worker() {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.route("**/*", (route) => {
      const type = route.request().resourceType();
      if (["image", "stylesheet", "font"].includes(type)) route.abort();
      else route.continue();
    });

    while (queue.length > 0) {
      const url = queue.shift();
      if (!url || visited.has(url) || !isAllowed(url)) continue;
      visited.add(url);

      await limiter();
      const effectiveDelay = !fastMode && crawlDelay > 0
        ? Math.min(crawlDelay, 2000)
        : 0;

      if (effectiveDelay > 0) {
        await new Promise((r) => setTimeout(r, effectiveDelay));
      }

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

        const links = await page.evaluate(() =>
          Array.from(document.querySelectorAll("a[href]")).map((a) =>
            (a as HTMLAnchorElement).getAttribute("href") || ""
          )
        );

        for (const link of links) {
          try {
            const normalized = new URL(link, url).href;
            const startOrigin = new URL(startUrl).origin;
            if (
              normalized.startsWith(startOrigin) && !visited.has(normalized)
            ) {
              queue.push(normalized);
            }
          } catch {
            // ignoring errors
          }
        }

        pagesCrawled++;
        const elapsed = (Date.now() - startTime) / 1000;
        const perSecond = parseFloat((pagesCrawled / elapsed).toFixed(2));
        onProgress?.({
          visited: visited.size,
          queued: queue.length,
          perSecond,
        });
      } catch (err) {
        console.warn(`Error loading ${url}: ${err}`);
      }
    }

    await context.close();
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  await browser.close();
  return Array.from(visited);
}

async function getRobotsConfig(baseUrl: string) {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).href;
    const text = await fetch(robotsUrl).then((r) => r.text());
    const lines = text.split("\n");
    const disallowed: string[] = [];
    let crawlDelay = 0;

    for (const line of lines) {
      const l = line.trim().toLowerCase();
      if (l.startsWith("disallow:")) {
        const path = l.replace("disallow:", "").trim();
        if (path) disallowed.push(path);
      }
      if (l.startsWith("crawl-delay:")) {
        const val = parseInt(l.replace("crawl-delay:", "").trim());
        if (!isNaN(val)) crawlDelay = val * 1000;
      }
    }
    return { disallowed, crawlDelay };
  } catch {
    return { disallowed: [], crawlDelay: 0 };
  }
}

function createLimiter(rps: number) {
  let last = 0;
  return async () => {
    const now = Date.now();
    const wait = Math.max(0, (1000 / rps) - (now - last));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    last = Date.now();
  };
}
