import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

function cssRule(selector: string): string {
  const ruleStart = cssSource.indexOf(`${selector} {`);
  assert.notEqual(ruleStart, -1, `missing CSS rule for ${selector}`);
  const bodyStart = cssSource.indexOf("{", ruleStart) + 1;
  const bodyEnd = cssSource.indexOf("}", bodyStart);
  assert.notEqual(bodyEnd, -1, `unterminated CSS rule for ${selector}`);
  return cssSource.slice(bodyStart, bodyEnd);
}

function pixelValue(rule: string, property: string): number {
  const match = rule.match(new RegExp(`${property}:\\s*(\\d+(?:\\.\\d+)?)px`));
  assert.ok(match, `missing pixel value for ${property}`);
  return Number(match[1]);
}

describe("selected level detail polish", () => {
  it("keeps a clear semantic order and accessible mode controls", () => {
    const detailStart = appSource.indexOf('<section className="season-summary" aria-label="Juego actual">');
    const detailEnd = appSource.indexOf("                ) : (", detailStart);
    assert.ok(detailStart >= 0 && detailEnd > detailStart, "selected level detail branch should be present");
    const detailSource = appSource.slice(detailStart, detailEnd);

    const sections = ["season-summary", "season-level-row", "level-mode-panel", "season-facts"];
    let previousIndex = -1;
    for (const section of sections) {
      const sectionIndex = detailSource.indexOf(`className="${section}"`);
      assert.ok(sectionIndex > previousIndex, `${section} should follow the previous detail section`);
      previousIndex = sectionIndex;
    }

    assert.match(detailSource, /role="group" aria-label="Cambiar modo de niveles"/);
    assert.match(detailSource, /aria-pressed=\{selectedLevelMode === "challenge"\}/);
    assert.match(detailSource, /aria-pressed=\{selectedLevelMode === "free"\}/);
    assert.match(detailSource, /onClick=\{\(\) => setLevelMode\(selectedGame, "challenge"\)\}/);
    assert.match(detailSource, /onClick=\{\(\) => setLevelMode\(selectedGame, "free"\)\}/);
    assert.match(detailSource, /aria-label=\{`Nivel \$\{selectedLevelIndex\} de \$\{selectedLevelTotal\}`\}/);
    assert.doesNotMatch(detailSource, /<span className="game-revision">/);
  });

  it("keeps the preview subordinate and removes nested card chrome", () => {
    const panelRule = cssRule(".detail-panel.level-detail-panel");
    const previewHeight = pixelValue(panelRule, "grid-template-rows");
    assert.ok(previewHeight >= 200 && previewHeight <= 260, "level preview should support rather than dominate the detail panel");

    const modePanelRule = cssRule(".level-detail-panel .level-mode-panel");
    assert.match(modePanelRule, /padding:\s*0/);
    assert.match(modePanelRule, /border:\s*0/);
    assert.match(modePanelRule, /background:\s*none/);

    const modeButtonRule = cssRule(".level-detail-panel .level-mode-toggle button");
    assert.ok(pixelValue(modeButtonRule, "min-height") >= 56, "mode buttons should remain touch friendly");
    const activeModeRule = cssRule(".level-detail-panel .level-mode-toggle button.active");
    assert.match(activeModeRule, /border-color:/);
    assert.match(activeModeRule, /background:/);

    const factRule = cssRule(".level-detail-panel .season-facts div");
    assert.match(factRule, /border:\s*0/);
    assert.match(factRule, /background:\s*transparent/);
    assert.match(cssRule(".level-detail-panel .season-facts div + div"), /border-left:/);
  });

  it("preserves a restrained type hierarchy", () => {
    const gameTitleSize = pixelValue(cssRule(".level-detail-panel .season-title-row h2"), "font-size");
    const levelTitleSize = pixelValue(cssRule(".level-detail-panel .season-level-row strong"), "font-size");
    const factLabelSize = pixelValue(cssRule(".level-detail-panel .season-facts span"), "font-size");
    const factValueSize = pixelValue(cssRule(".level-detail-panel .season-facts strong"), "font-size");

    assert.ok(gameTitleSize > levelTitleSize, "game title should lead the selected level title");
    assert.ok(factValueSize > factLabelSize, "fact values should lead their labels");
  });
});
