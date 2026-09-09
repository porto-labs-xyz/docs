#!/usr/bin/env node
// Pulls the PIPs and whitepaper repos (source of truth lives there, not here)
// into docs/ at build time, adding Docusaurus frontmatter as it goes.
import { execSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ORG = "porto-labs-xyz";
const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");

function cloneShallow(repo, destDir) {
  execSync(`git clone --depth 1 https://github.com/${ORG}/${repo}.git "${destDir}"`, {
    stdio: "inherit",
  });
}

function stripFrontmatter(md) {
  return md.replace(/^---\n[\s\S]*?\n---\n/, "");
}

function writeDoc(filePath, frontmatter, body) {
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  writeFileSync(filePath, `---\n${fm}\n---\n\n${stripFrontmatter(body)}`);
}

const work = mkdtempSync(path.join(tmpdir(), "porto-docs-"));

try {
  // --- Whitepaper -----------------------------------------------------
  const wpDir = path.join(work, "whitepaper");
  cloneShallow("whitepaper", wpDir);
  const wpBody = readFileSync(path.join(wpDir, "porto-whitepaper.md"), "utf8")
    .replace(/\]\(\.\.\/pips\/README\.md\)/g, "](/pips)")
    .replace(/\]\(\.\.\/pips\/PIP-(\d+)\.md(#[\w-]*)?\)/g, "](/pips/pip-$1$2)");
  writeDoc(
    path.join(DOCS_DIR, "whitepaper.md"),
    { id: "whitepaper", title: "Whitepaper", sidebar_position: 1, slug: "/whitepaper" },
    wpBody
  );
  console.log("pulled whitepaper");

  // --- PIPs -------------------------------------------------------------
  const pipsSrc = path.join(work, "pips");
  cloneShallow("PIPs", pipsSrc);

  const pipsOutDir = path.join(DOCS_DIR, "pips");
  mkdirSync(pipsOutDir, { recursive: true });

  // Category config so the sidebar groups all PIPs together.
  writeFileSync(
    path.join(pipsOutDir, "_category_.json"),
    JSON.stringify(
      { label: "PIPs", position: 2, link: { type: "doc", id: "pips/index" } },
      null,
      2
    ) + "\n"
  );

  const readme = readFileSync(path.join(pipsSrc, "README.md"), "utf8");
  writeDoc(
    path.join(pipsOutDir, "index.md"),
    { id: "index", title: "Porto Improvement Proposals", slug: "/pips" },
    readme.replace(/\]\(\.\/PIP-(\d+)\.md/g, "](/pips/pip-$1")
  );

  // Title + status lookup, scraped from the README index table so new
  // PIPs are picked up automatically without editing this script.
  const rowRe = /\|\s*\[(\d+)\]\(\.\/PIP-\d+\.md\)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/g;
  const meta = new Map();
  for (const [, num, title, type, status] of readme.matchAll(rowRe)) {
    meta.set(num, { title: title.trim(), type: type.trim(), status: status.trim() });
  }

  const pipFiles = readdirSync(pipsSrc).filter((f) => /^PIP-\d+\.md$/.test(f));
  for (const file of pipFiles) {
    const num = file.match(/^PIP-(\d+)\.md$/)[1];
    const body = readFileSync(path.join(pipsSrc, file), "utf8").replace(
      /\]\(\.\/PIP-(\d+)\.md(#[\w-]*)?\)/g,
      "](/pips/pip-$1$2)"
    );
    const info = meta.get(num) ?? { title: `PIP-${num}`, type: "", status: "" };
    writeDoc(path.join(pipsOutDir, `pip-${num}.md`), {
      id: `pip-${num}`,
      title: `PIP-${num}: ${info.title}`,
      sidebar_label: `PIP-${num} , ${info.title}`,
      sidebar_position: Number(num),
      slug: `/pips/pip-${num}`,
    }, body);
  }
  console.log(`pulled ${pipFiles.length} PIPs`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
