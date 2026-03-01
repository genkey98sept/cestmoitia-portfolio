/**
 * Script d'aspiration systematique du site Framer cestmoitia.
 *
 * Usage: npx tsx scripts/scrape-framer.ts
 *
 * Output: _bmad-output/framer-scrape/
 *   - pages/<slug>/screenshot-{desktop,tablet,mobile}.png
 *   - pages/<slug>/text-content.json
 *   - pages/<slug>/links.json
 *   - pages/<slug>/computed-styles.json
 *   - pages/<slug>/images.json
 *   - pages/<slug>/videos.json
 *   - pages/<slug>/animations.json
 *   - pages/<slug>/hover-states.json
 *   - assets/fonts/   (fichiers .woff2)
 *   - assets/images/   (images telechargees)
 *   - design-tokens.json
 *   - fonts.json
 *   - scrape-report.json
 *   - scrape-report.md
 */

import { chromium, type Page, type Browser } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const BASE_URL = "https://cestmoitia.framer.website";

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "work", path: "/work" },
  { slug: "photography", path: "/photography" },
  { slug: "contact", path: "/contact" },
  { slug: "work-projet-perso", path: "/work/projet-perso" },
  { slug: "work-socredo", path: "/work/socredo" },
  { slug: "work-exotic-garden", path: "/work/exotic-garden" },
  { slug: "work-aremiti", path: "/work/aremiti" },
  { slug: "work-biga-ranx", path: "/work/biga-ranx" },
  { slug: "work-amex", path: "/work/amex" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 810, height: 1080 },
  { name: "mobile", width: 390, height: 844 },
];

const OUTPUT_DIR = path.resolve(__dirname, "../_bmad-output/framer-scrape");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ensureDir = (dir: string) => fs.mkdirSync(dir, { recursive: true });

const downloadFile = (url: string, dest: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve();
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    proto
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return downloadFile(res.headers.location, dest).then(resolve, reject);
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", (err) => { fs.unlink(dest, () => {}); reject(err); });
  });

const sanitizeFilename = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

// ---------------------------------------------------------------------------
// Browser-side scripts (string-based to avoid tsx __name transformation)
// ---------------------------------------------------------------------------

const SCRIPT_TEXT_CONTENT = `(() => {
  var result = {};
  var getSection = (el) => {
    var tag = el.tagName.toLowerCase();
    if (["header","footer","main","nav","section","article"].indexOf(tag) !== -1) return tag;
    var fn = el.getAttribute("data-framer-name");
    if (fn) return "framer:" + fn;
    if (el.id) return "#" + el.id;
    if (el.parentElement) return getSection(el.parentElement);
    return "body";
  };
  var allEls = document.body.querySelectorAll("*");
  for (var i = 0; i < allEls.length; i++) {
    var el = allEls[i];
    var style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    for (var j = 0; j < el.childNodes.length; j++) {
      var child = el.childNodes[j];
      if (child.nodeType !== 3) continue;
      var text = child.textContent ? child.textContent.trim() : "";
      if (!text) continue;
      var section = getSection(el);
      if (!result[section]) result[section] = [];
      if (result[section].indexOf(text) === -1) result[section].push(text);
    }
  }
  return result;
})()`;

const SCRIPT_LINKS = `(() => {
  var links = [];
  var anchors = document.querySelectorAll("a[href]");
  for (var i = 0; i < anchors.length; i++) {
    var a = anchors[i];
    var style = window.getComputedStyle(a);
    if (style.display === "none") continue;
    var closest = a.closest("header, footer, nav, main, section");
    links.push({
      text: a.textContent ? a.textContent.trim() : "",
      href: a.href,
      section: closest ? closest.tagName.toLowerCase() : "body"
    });
  }
  return links;
})()`;

const SCRIPT_COMPUTED_STYLES = `(() => {
  var styles = {};
  var selectors = ["h1","h2","h3","h4","h5","h6","p","a","button","input","textarea","header","footer","nav","main","[data-framer-name]"];
  var props = ["font-family","font-size","font-weight","line-height","letter-spacing","text-transform","text-decoration","color","background-color","background-image","padding","padding-top","padding-right","padding-bottom","padding-left","margin-top","margin-bottom","border","border-radius","display","flex-direction","justify-content","align-items","gap","grid-template-columns","grid-gap","width","max-width","height","max-height","min-height","position","top","left","z-index","opacity","mix-blend-mode","filter","backdrop-filter","overflow","box-shadow","text-shadow","transition","animation","transform","aspect-ratio","object-fit"];
  var idx = 0;
  for (var s = 0; s < selectors.length; s++) {
    var els = document.querySelectorAll(selectors[s]);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight * 3) continue;
      var computed = window.getComputedStyle(el);
      var extracted = {};
      for (var p = 0; p < props.length; p++) {
        var val = computed.getPropertyValue(props[p]);
        if (val && val !== "none" && val !== "normal" && val !== "0px" && val !== "auto" && val !== "0s" && val !== "rgba(0, 0, 0, 0)") {
          extracted[props[p]] = val;
        }
      }
      var textC = el.textContent ? el.textContent.trim().slice(0, 80) : "";
      var fn = el.getAttribute("data-framer-name") || "";
      var key = selectors[s] + "[" + idx + "]" + (fn ? ":" + fn : "");
      styles[key] = Object.assign({
        _tag: el.tagName.toLowerCase(),
        _text: textC,
        _framerName: fn,
        _rect: Math.round(rect.x) + "," + Math.round(rect.y) + " " + Math.round(rect.width) + "x" + Math.round(rect.height)
      }, extracted);
      idx++;
    }
  }
  return styles;
})()`;

const SCRIPT_IMAGES = `(() => {
  var images = [];
  var imgs = document.querySelectorAll("img");
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    var rect = img.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    images.push({
      src: img.src,
      alt: img.alt || "",
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  }
  var allEls = document.querySelectorAll("*");
  for (var j = 0; j < allEls.length; j++) {
    var el = allEls[j];
    var style = window.getComputedStyle(el);
    var bg = style.backgroundImage;
    if (bg && bg !== "none") {
      var matches = bg.match(/url\\("?([^")\\s]+)"?\\)/g);
      if (matches) {
        for (var k = 0; k < matches.length; k++) {
          var url = matches[k].replace(/url\\("?|"?\\)/g, "");
          if (url.indexOf("data:") === 0) continue;
          var r2 = el.getBoundingClientRect();
          images.push({ src: url, alt: "", width: Math.round(r2.width), height: Math.round(r2.height), naturalWidth: 0, naturalHeight: 0 });
        }
      }
    }
  }
  var vids = document.querySelectorAll("video");
  for (var v = 0; v < vids.length; v++) {
    if (vids[v].poster) {
      images.push({ src: vids[v].poster, alt: "video-poster", width: vids[v].videoWidth || 0, height: vids[v].videoHeight || 0, naturalWidth: 0, naturalHeight: 0 });
    }
  }
  return images;
})()`;

const SCRIPT_VIDEOS = `(() => {
  var videos = [];
  var vids = document.querySelectorAll("video");
  for (var i = 0; i < vids.length; i++) {
    var v = vids[i];
    var rect = v.getBoundingClientRect();
    var sources = v.querySelectorAll("source");
    var src = v.src || (sources.length > 0 ? sources[0].src : "");
    videos.push({ src: src, poster: v.poster || "", width: Math.round(rect.width), height: Math.round(rect.height) });
  }
  return videos;
})()`;

const SCRIPT_FONTS = `(() => {
  var fonts = [];
  for (var s = 0; s < document.styleSheets.length; s++) {
    try {
      var rules = document.styleSheets[s].cssRules;
      for (var r = 0; r < rules.length; r++) {
        if (rules[r] instanceof CSSFontFaceRule) {
          var rule = rules[r];
          fonts.push({
            family: rule.style.getPropertyValue("font-family").replace(/['"]/g, ""),
            src: rule.style.getPropertyValue("src"),
            weight: rule.style.getPropertyValue("font-weight") || "400",
            style: rule.style.getPropertyValue("font-style") || "normal"
          });
        }
      }
    } catch(e) {}
  }
  return fonts;
})()`;

const SCRIPT_ANIMATIONS = `(() => {
  var animations = [];
  var seen = {};
  var allEls = document.querySelectorAll("*");
  for (var i = 0; i < allEls.length; i++) {
    var el = allEls[i];
    var rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    var computed = window.getComputedStyle(el);
    var identifier = el.getAttribute("data-framer-name") || el.tagName.toLowerCase();
    var text = el.textContent ? el.textContent.trim().slice(0, 40) : "";
    var transition = computed.transition;
    if (transition && transition !== "all 0s ease 0s" && transition !== "none" && transition.indexOf("0s") === -1) {
      var key1 = identifier + ":transition:" + transition;
      if (!seen[key1]) {
        seen[key1] = true;
        animations.push({ element: identifier, text: text, type: "transition", properties: transition, duration: computed.transitionDuration, easing: computed.transitionTimingFunction, delay: computed.transitionDelay });
      }
    }
    var animName = computed.animationName;
    if (animName && animName !== "none") {
      var key2 = identifier + ":animation:" + animName;
      if (!seen[key2]) {
        seen[key2] = true;
        animations.push({ element: identifier, text: text, type: "animation", properties: animName, duration: computed.animationDuration, easing: computed.animationTimingFunction, delay: computed.animationDelay });
      }
    }
    try {
      var webAnims = el.getAnimations();
      for (var a = 0; a < webAnims.length; a++) {
        var wa = webAnims[a];
        var timing = wa.effect ? wa.effect.getTiming() : {};
        var key3 = identifier + ":web:" + (wa.animationName || wa.constructor.name);
        if (!seen[key3]) {
          seen[key3] = true;
          animations.push({ element: identifier, text: text, type: "web-animation", properties: wa.animationName || wa.constructor.name, duration: String(timing.duration || ""), easing: String(timing.easing || ""), delay: String(timing.delay || "0") });
        }
      }
    } catch(e) {}
  }
  return animations;
})()`;

const SCRIPT_ANIMATION_HINTS = `(() => {
  var hints = [];
  var allEls = document.querySelectorAll("*");
  for (var i = 0; i < allEls.length; i++) {
    var el = allEls[i];
    var rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    var computed = window.getComputedStyle(el);
    var wc = computed.willChange;
    var tr = computed.transform;
    if ((wc && wc !== "auto") || (tr && tr !== "none")) {
      var id = el.getAttribute("data-framer-name") || (el.className ? el.className.toString().slice(0, 50) : el.tagName);
      hints.push({ element: id, text: el.textContent ? el.textContent.trim().slice(0, 40) : "", willChange: wc || "auto", transform: tr || "none", opacity: computed.opacity });
    }
  }
  return hints;
})()`;

const SCRIPT_CSS_VARIABLES = `(() => {
  var vars = {};
  for (var s = 0; s < document.styleSheets.length; s++) {
    try {
      var rules = document.styleSheets[s].cssRules;
      for (var r = 0; r < rules.length; r++) {
        if (rules[r] instanceof CSSStyleRule && rules[r].selectorText === ":root") {
          var style = rules[r].style;
          for (var i = 0; i < style.length; i++) {
            var prop = style[i];
            if (prop.indexOf("--") === 0) {
              vars[prop] = style.getPropertyValue(prop).trim();
            }
          }
        }
      }
    } catch(e) {}
  }
  return vars;
})()`;

// ---------------------------------------------------------------------------
// Hover state extraction (needs page interaction, not pure evaluate)
// ---------------------------------------------------------------------------

async function extractHoverStates(page: Page) {
  const hoverStates: { element: string; changes: Record<string, { before: string; after: string }> }[] = [];
  const propsToCheck = ["color", "background-color", "opacity", "transform", "box-shadow", "text-decoration", "border-color", "filter", "scale"];

  // Get interactive elements
  const elements = await page.evaluate(`(() => {
    var elements = [];
    var all = document.querySelectorAll("a, button, [role='button']");
    for (var i = 0; i < all.length && i < 30; i++) {
      var el = all[i];
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.top > window.innerHeight * 2) continue;
      elements.push({
        index: i,
        tag: el.tagName.toLowerCase(),
        text: el.textContent ? el.textContent.trim().slice(0, 40) : "",
        x: Math.round(rect.x + rect.width / 2),
        y: Math.round(rect.y + rect.height / 2)
      });
    }
    return elements;
  })()`);

  for (const elem of elements as any[]) {
    try {
      // Get styles before hover
      const beforeStyles = await page.evaluate(`((x, y, props) => {
        var el = document.elementFromPoint(x, y);
        if (!el) return {};
        var computed = window.getComputedStyle(el);
        var result = {};
        for (var i = 0; i < props.length; i++) result[props[i]] = computed.getPropertyValue(props[i]);
        return result;
      })(${elem.x}, ${elem.y}, ${JSON.stringify(propsToCheck)})`);

      // Hover
      await page.mouse.move(elem.x, elem.y);
      await page.waitForTimeout(400);

      // Get styles after hover
      const afterStyles = await page.evaluate(`((x, y, props) => {
        var el = document.elementFromPoint(x, y);
        if (!el) return {};
        var computed = window.getComputedStyle(el);
        var result = {};
        for (var i = 0; i < props.length; i++) result[props[i]] = computed.getPropertyValue(props[i]);
        return result;
      })(${elem.x}, ${elem.y}, ${JSON.stringify(propsToCheck)})`);

      // Detect changes
      const changes: Record<string, { before: string; after: string }> = {};
      for (const prop of propsToCheck) {
        if ((beforeStyles as any)[prop] !== (afterStyles as any)[prop]) {
          changes[prop] = { before: (beforeStyles as any)[prop], after: (afterStyles as any)[prop] };
        }
      }

      if (Object.keys(changes).length > 0) {
        hoverStates.push({ element: `${elem.tag} "${elem.text}"`, changes });
      }

      // Move away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
    } catch {
      // Skip elements that can't be hovered
    }
  }

  return hoverStates;
}

// ---------------------------------------------------------------------------
// Main scraper
// ---------------------------------------------------------------------------

async function scrapePage(browser: Browser, pageConfig: { slug: string; path: string }) {
  const url = `${BASE_URL}${pageConfig.path}`;
  const pageDir = path.join(OUTPUT_DIR, "pages", pageConfig.slug);
  ensureDir(pageDir);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Scraping: ${pageConfig.slug} (${url})`);
  console.log(`${"=".repeat(60)}`);

  const pageData: Record<string, unknown> = { slug: pageConfig.slug, url, scrapedAt: new Date().toISOString() };

  const context = await browser.newContext({
    viewport: VIEWPORTS[0],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(3000); // Let Framer JS + animations settle

    // 1. Screenshots at all viewports
    console.log("  [1/9] Screenshots...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(800);
      await page.screenshot({ fullPage: true, path: path.join(pageDir, `screenshot-${vp.name}.png`) });
      console.log(`    -> ${vp.name} (${vp.width}px)`);
    }
    // Reset to desktop
    await page.setViewportSize(VIEWPORTS[0]);
    await page.waitForTimeout(500);

    // 2. Text content
    console.log("  [2/9] Text content...");
    pageData.textContent = await page.evaluate(SCRIPT_TEXT_CONTENT);
    fs.writeFileSync(path.join(pageDir, "text-content.json"), JSON.stringify(pageData.textContent, null, 2));

    // 3. Links
    console.log("  [3/9] Links...");
    pageData.links = await page.evaluate(SCRIPT_LINKS);
    fs.writeFileSync(path.join(pageDir, "links.json"), JSON.stringify(pageData.links, null, 2));

    // 4. Computed styles
    console.log("  [4/9] Computed styles...");
    pageData.computedStyles = await page.evaluate(SCRIPT_COMPUTED_STYLES);
    fs.writeFileSync(path.join(pageDir, "computed-styles.json"), JSON.stringify(pageData.computedStyles, null, 2));

    // 5. Images
    console.log("  [5/9] Images...");
    pageData.images = await page.evaluate(SCRIPT_IMAGES);
    fs.writeFileSync(path.join(pageDir, "images.json"), JSON.stringify(pageData.images, null, 2));

    // 6. Videos
    console.log("  [6/9] Videos...");
    pageData.videos = await page.evaluate(SCRIPT_VIDEOS);
    fs.writeFileSync(path.join(pageDir, "videos.json"), JSON.stringify(pageData.videos, null, 2));

    // 7. Animations
    console.log("  [7/9] Animations & transitions...");
    const animations = await page.evaluate(SCRIPT_ANIMATIONS);
    const animationHints = await page.evaluate(SCRIPT_ANIMATION_HINTS);
    pageData.animations = animations;
    pageData.animationHints = animationHints;
    fs.writeFileSync(path.join(pageDir, "animations.json"), JSON.stringify({ animations, hints: animationHints }, null, 2));

    // 8. Hover states
    console.log("  [8/9] Hover states...");
    pageData.hoverStates = await extractHoverStates(page);
    fs.writeFileSync(path.join(pageDir, "hover-states.json"), JSON.stringify(pageData.hoverStates, null, 2));

    // 9. CSS Variables (homepage only)
    if (pageConfig.slug === "home") {
      console.log("  [9/9] CSS variables (design tokens)...");
      pageData.cssVariables = await page.evaluate(SCRIPT_CSS_VARIABLES);
      fs.writeFileSync(path.join(OUTPUT_DIR, "design-tokens.json"), JSON.stringify(pageData.cssVariables, null, 2));
    } else {
      console.log("  [9/9] CSS variables — skipped (homepage only)");
    }

    // Save complete page data
    fs.writeFileSync(path.join(pageDir, "page-data.json"), JSON.stringify(pageData, null, 2));
  } finally {
    await context.close();
  }

  return pageData;
}

// ---------------------------------------------------------------------------
// Asset downloads
// ---------------------------------------------------------------------------

async function downloadFonts(allFonts: any[]) {
  const fontsDir = path.join(OUTPUT_DIR, "assets", "fonts");
  ensureDir(fontsDir);

  const fontUrls = new Set<string>();
  for (const font of allFonts) {
    const matches = font.src.matchAll(/url\("?([^")\s]+)"?\)/g);
    for (const match of matches) {
      let url = match[1];
      if (url.startsWith("//")) url = "https:" + url;
      if (url.includes(".woff2") || url.includes(".woff") || url.includes(".ttf")) {
        fontUrls.add(url);
      }
    }
  }

  console.log(`\nDownloading ${fontUrls.size} font files...`);
  for (const url of fontUrls) {
    const filename = sanitizeFilename(url.split("/").pop() || "font");
    const dest = path.join(fontsDir, filename);
    try {
      await downloadFile(url, dest);
      console.log(`  -> ${filename}`);
    } catch (err) {
      console.log(`  [SKIP] ${filename}: ${err}`);
    }
  }
}

async function downloadImages(allImages: any[]) {
  const imagesDir = path.join(OUTPUT_DIR, "assets", "images");
  ensureDir(imagesDir);

  const seen = new Set<string>();
  const unique = allImages.filter((img: any) => {
    if (!img.src || seen.has(img.src) || img.src.startsWith("data:")) return false;
    seen.add(img.src);
    return true;
  });

  console.log(`\nDownloading ${unique.length} images...`);
  for (const img of unique) {
    const filename = sanitizeFilename(img.src.split("?")[0].split("/").pop() || "image.png");
    const dest = path.join(imagesDir, filename);
    try {
      await downloadFile(img.src, dest);
      console.log(`  -> ${filename}`);
    } catch (err) {
      console.log(`  [SKIP] ${filename}: ${err}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function generateReport(allPageData: any[]) {
  const report = {
    generatedAt: new Date().toISOString(),
    sourceUrl: BASE_URL,
    totalPages: allPageData.length,
    pages: allPageData.map((p: any) => ({
      slug: p.slug, url: p.url,
      textSections: Object.keys(p.textContent || {}),
      linkCount: p.links?.length || 0,
      imageCount: p.images?.length || 0,
      videoCount: p.videos?.length || 0,
      animationCount: p.animations?.length || 0,
      hoverStateCount: p.hoverStates?.length || 0,
    })),
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, "scrape-report.json"), JSON.stringify(report, null, 2));

  // Human-readable summary
  let md = `# Rapport d'Aspiration — cestmoitia.framer.website\n\n`;
  md += `**Date :** ${new Date().toISOString()}\n`;
  md += `**Pages scrapees :** ${allPageData.length}\n\n`;

  for (const p of allPageData) {
    md += `---\n\n## ${p.slug} (${p.url})\n\n`;

    if (p.textContent && Object.keys(p.textContent).length > 0) {
      md += `### Texte extrait\n\n`;
      for (const [section, texts] of Object.entries(p.textContent) as [string, string[]][]) {
        md += `**${section}:**\n`;
        for (const text of texts) md += `- "${text}"\n`;
        md += "\n";
      }
    }

    if (p.links?.length) {
      md += `### Liens (${p.links.length})\n\n`;
      for (const l of p.links) md += `- [${l.text || "(vide)"}](${l.href}) — ${l.section}\n`;
      md += "\n";
    }

    if (p.images?.length) {
      md += `### Images (${p.images.length})\n\n`;
      for (const img of p.images) md += `- ${img.alt || "(no alt)"} — ${img.width}x${img.height}${img.naturalWidth ? ` (native: ${img.naturalWidth}x${img.naturalHeight})` : ""} — ${img.src.slice(0, 100)}\n`;
      md += "\n";
    }

    if (p.videos?.length) {
      md += `### Videos (${p.videos.length})\n\n`;
      for (const v of p.videos) md += `- ${v.src.slice(0, 100)} — ${v.width}x${v.height}\n`;
      md += "\n";
    }

    if (p.animations?.length) {
      md += `### Animations (${p.animations.length})\n\n`;
      for (const a of p.animations) md += `- **${a.element}** (${a.type}): ${a.properties} — duration: ${a.duration}, easing: ${a.easing}\n`;
      md += "\n";
    }

    if (p.animationHints?.length) {
      md += `### Animation Hints (will-change/transform) (${p.animationHints.length})\n\n`;
      for (const h of p.animationHints) md += `- **${h.element}**: will-change=${h.willChange}, transform=${h.transform}, opacity=${h.opacity}\n`;
      md += "\n";
    }

    if (p.hoverStates?.length) {
      md += `### Hover States (${p.hoverStates.length})\n\n`;
      for (const hs of p.hoverStates) {
        md += `- **${hs.element}:**\n`;
        for (const [prop, val] of Object.entries(hs.changes) as [string, { before: string; after: string }][]) {
          md += `  - ${prop}: \`${val.before}\` → \`${val.after}\`\n`;
        }
      }
      md += "\n";
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "scrape-report.md"), md);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  console.log("==============================================");
  console.log("  ASPIRATION SYSTEMATIQUE — cestmoitia.framer");
  console.log("==============================================\n");

  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, "pages"));
  ensureDir(path.join(OUTPUT_DIR, "assets", "images"));
  ensureDir(path.join(OUTPUT_DIR, "assets", "fonts"));

  const browser = await chromium.launch({ headless: true });

  try {
    // Phase 1: Fonts
    console.log("Phase 1: Extraction des fonts...");
    const ctx = await browser.newContext({ viewport: VIEWPORTS[0] });
    const fontPage = await ctx.newPage();
    await fontPage.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    await fontPage.waitForTimeout(2000);
    const allFonts = await fontPage.evaluate(SCRIPT_FONTS);
    fs.writeFileSync(path.join(OUTPUT_DIR, "fonts.json"), JSON.stringify(allFonts, null, 2));
    console.log(`  -> ${(allFonts as any[]).length} declarations @font-face`);
    await ctx.close();

    // Phase 2: Scrape all pages
    console.log("\nPhase 2: Aspiration des pages...");
    const allPageData: any[] = [];
    for (const pc of PAGES) {
      try {
        const data = await scrapePage(browser, pc);
        allPageData.push(data);
      } catch (err) {
        console.error(`  [ERROR] ${pc.slug}: ${err}`);
      }
    }

    // Phase 3: Download fonts
    console.log("\nPhase 3: Telechargement des fonts...");
    await downloadFonts(allFonts as any[]);

    // Phase 4: Download images
    console.log("\nPhase 4: Telechargement des images...");
    const allImages: any[] = [];
    for (const p of allPageData) {
      if (p.images) allImages.push(...p.images);
    }
    await downloadImages(allImages);

    // Phase 5: Report
    console.log("\nPhase 5: Generation du rapport...");
    generateReport(allPageData);

    console.log("\n==============================================");
    console.log("  ASPIRATION TERMINEE");
    console.log(`  Output: ${OUTPUT_DIR}`);
    console.log("==============================================");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("ERREUR:", err);
  process.exit(1);
});
