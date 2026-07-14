import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const floorPreviewSource = readFileSync(new URL("../src/FloorPreview.tsx", import.meta.url), "utf8");

function exactRuleBodies(selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...cssSource.matchAll(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`, "g"))].map((match) => match[1]);
}

function lastPixelValue(selector: string, property: string): number {
  const bodies = exactRuleBodies(selector);
  assert.ok(bodies.length, `missing CSS rule for ${selector}`);
  for (let index = bodies.length - 1; index >= 0; index -= 1) {
    const match = bodies[index].match(new RegExp(`${property}:\\s*(\\d+(?:\\.\\d+)?)px`));
    if (match) return Number(match[1]);
  }
  assert.fail(`missing ${property} for ${selector}`);
}

describe("player menu kiosk contract", () => {
  it("preserves the fixed 16:9 surface and internal touch scrolling", () => {
    assert.match(cssSource, /\.app\.playing\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
    assert.match(exactRuleBodies(".games").join("\n"), /overflow-y:\s*auto/);
    assert.match(exactRuleBodies(".games").join("\n"), /touch-action:\s*pan-y/);
    assert.match(exactRuleBodies(".levels-grid").join("\n"), /overflow-y:\s*auto/);
    assert.match(exactRuleBodies(".levels-grid").join("\n"), /touch-action:\s*pan-y/);
    assert.ok(lastPixelValue(".tab", "min-height") >= 56, "category tabs should remain touch friendly");
    assert.ok(lastPixelValue(".level-detail-panel .game-revision-refresh", "height") >= 56, "catalog refresh should remain touch friendly");
  });

  it("uses a balanced two-card grid and one segmented difficulty surface", () => {
    assert.match(exactRuleBodies(".games.count-2").join("\n"), /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    assert.match(exactRuleBodies(".games.count-2").join("\n"), /align-content:\s*start/);
    const difficultyShell = exactRuleBodies(".launch-difficulty").join("\n");
    assert.match(difficultyShell, /border:/);
    assert.match(difficultyShell, /padding:/);
    assert.match(exactRuleBodies(".launch-deck-label").join("\n"), /border:\s*0/);
    assert.match(cssSource, /\.roster\s*>\s*\.player:only-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
  });

  it("retains selection, modal, focus, and announcement semantics", () => {
    assert.match(appSource, /className=\{`tab[^`]*`\}[^>]*aria-pressed=/s);
    assert.match(appSource, /className=\{`card game-card[^`]*`\}[^>]*aria-pressed=\{selected\}/s);
    assert.match(appSource, /className=\{`launch-difficulty-button[^`]*`\}[^>]*aria-pressed=/s);
    assert.match(appSource, /role=\"radiogroup\"[^>]*onKeyDown=\{handleRadioGroupKeyDown\}/);
    assert.match(appSource, /tabIndex=\{active \? 0 : -1\}/);
    assert.match(appSource, /trapKioskFocus\(event, \(\) => setTeamOpen\(false\)\)/);
    assert.match(appSource, /role=\{error \? "alert" : "status"\}/);
    assert.match(appSource, /aria-live=\{error \? "assertive" : "polite"\}/);
    assert.match(appSource, /className=\{`pin-error[^`]*`\} aria-live="assertive" aria-atomic="true"/);
  });

  it("respects motion preferences and avoids sticky touch hover", () => {
    assert.match(cssSource, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    assert.match(cssSource, /@media\s*\(hover:\s*none\),\s*\(pointer:\s*coarse\)/);
  });

  it("pauses hidden previews and budgets compact-card animation work", () => {
    assert.match(floorPreviewSource, /new IntersectionObserver/);
    assert.match(floorPreviewSource, /!document\.hidden && inViewport/);
    assert.match(floorPreviewSource, /draw\(2\.4\)/);
    assert.match(appSource, /fps=\{compact \? 28 : 50\}/);
  });
});
