export default async (request, context) => {
  const siteUrl = new URL(request.url).origin;

  // Haetaan ravintolalista sovelluksen omasta restaurants.json:sta
  const restaurantsRes = await fetch(`${siteUrl}/restaurants.json`);
  const restaurants = await restaurantsRes.json();

  const today = new Date();
  // Helsinki timezone
  const dayNumber = new Intl.DateTimeFormat("fi-FI", {
    timeZone: "Europe/Helsinki",
    weekday: "long",
  })
    .format(today)
    .toLowerCase();

  const dayNames = {
    maanantai: 1,
    tiistai: 2,
    keskiviikko: 3,
    torstai: 4,
    perjantai: 5,
    lauantai: 6,
    sunnuntai: 7,
  };
  const todayNumber = dayNames[dayNumber] ?? 1;
  const todayFi = dayNumber.charAt(0).toUpperCase() + dayNumber.slice(1);

  const RESET = "\x1b[0m";
  const BOLD = "\x1b[1m";
  const CYAN = "\x1b[36m";
  const YELLOW = "\x1b[33m";
  const DIM = "\x1b[2m";
  const RED = "\x1b[31m";

  let output = "";
  output += `\n${BOLD}${CYAN}🍽  Mitä tänään syötäisiin? ${RESET}${DIM}(${todayFi})${RESET}\n`;
  output += `${DIM}${"─".repeat(44)}${RESET}\n\n`;

  for (const restaurant of restaurants) {
    const emoji = restaurant.emoji ?? "🍴";
    const name = restaurant.nimi?.trim();

    // Käsin ylläpidetty lista (ei tassa.fi API)
    if (!restaurant.apiid) {
      let text = null;
      if (restaurant.list) {
        text = restaurant.list;
      } else if (restaurant.lists) {
        const weekdayKey = ["", "monday", "tuesday", "wednesday", "thursday", "friday"][todayNumber];
        text = restaurant.lists[weekdayKey] ?? null;
      }
      if (text) {
        output += `${BOLD}${emoji} ${name}${RESET}\n`;
        output += `  ${DIM}${text}${RESET}\n\n`;
      }
      continue;
    }

    // Tassa.fi API
    try {
      const url = `https://tassa.fi/resources/shop/${restaurant.apiid}/allads?l=fi&im=true&page=0&limit=18&city=Sein%C3%A4joki&u=jlfktwr6&uit=mobi-web-prod`;
      const res = await fetch(url);
      if (!res.ok) {
        output += `${BOLD}${emoji} ${name}${RESET}  ${RED}(ei listaa)${RESET}\n\n`;
        continue;
      }

      const text = await res.text();
      if (!text || text.trimStart().startsWith("<")) {
        output += `${BOLD}${emoji} ${name}${RESET}  ${RED}(ei listaa)${RESET}\n\n`;
        continue;
      }

      const parsed = JSON.parse(text);
      if (!parsed?.ads?.length) {
        output += `${BOLD}${emoji} ${name}${RESET}  ${RED}(ei listaa)${RESET}\n\n`;
        continue;
      }

      // Etsi tämän päivän lounaslista
      const weeklyAd = parsed.ads.find((a) => a.ad.weeklyLunch != null) ?? parsed.ads[parsed.ads.length - 1];
      const body = weeklyAd.ad.body ?? "";

      // Parsitaan HTML yksinkertaisesti regexillä (ei DOM:ia edge functionissa)
      // Etsi tämän päivän lunchHeader + lunchDesc
      const headerRegex = /class="[^"]*lunchHeader(\d)[^"]*"[^>]*>(.*?)<\/[^>]+>/gi;
      const descRegex = /class="[^"]*lunchDesc[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p|span)>/i;

      let foundToday = false;
      let match;
      while ((match = headerRegex.exec(body)) !== null) {
        const matchDayNumber = parseInt(match[1]);
        if (matchDayNumber === todayNumber) {
          foundToday = true;
          const dayTitle = match[2].replace(/<[^>]+>/g, "").trim();

          // Etsi seuraava lunchDesc tämän kohdan jälkeen
          const remaining = body.slice(match.index + match[0].length);
          const descMatch = descRegex.exec(remaining);
          const descHtml = descMatch ? descMatch[1] : "";

          // Muunna HTML plain textiksi
          const desc = descHtml
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&nbsp;/g, " ")
            .trim();

          output += `${BOLD}${emoji} ${name}${RESET}\n`;
          output += `  ${YELLOW}${dayTitle}${RESET}\n`;
          for (const line of desc.split("\n").filter((l) => l.trim())) {
            output += `  ${line.trim()}\n`;
          }
          output += "\n";
          break;
        }
      }

      if (!foundToday) {
        output += `${BOLD}${emoji} ${name}${RESET}  ${RED}(ei listaa tänään)${RESET}\n\n`;
      }
    } catch {
      output += `${BOLD}${emoji} ${name}${RESET}  ${RED}(virhe haettaessa)${RESET}\n\n`;
    }
  }

  output += `${DIM}${"─".repeat(44)}${RESET}\n`;
  output += `${DIM}Lähde: mitastanaansyotaisiin.fi${RESET}\n\n`;

  return new Response(output, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};

export const config = { path: "/curl" };
