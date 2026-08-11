package motionlevelsgames

import (
	"encoding/json"
	"os/exec"
	"path/filepath"
	"runtime"
	"testing"
	"time"
)

func TestResolveTaggedGamePrefersCanonicalIdentityAndRejectsAliasCollision(t *testing.T) {
	canonicalID := "c1daea4f-e586-4116-8cbe-871cde887a81"
	bundle := &Bundle{
		Manifest: Manifest{Runtime: BundleTarget{Games: []string{canonicalID, "other-product"}}},
		Catalog: []CatalogEntry{
			{ID: canonicalID, EngineGame: "motion-levels-games:" + canonicalID, Aliases: []string{"parkour"}, Tags: []string{PublishedLevelProductTag}},
			{ID: "other-product", Aliases: []string{"parkour"}, Tags: []string{PublishedLevelProductTag}},
		},
	}
	entry, err := bundle.ResolveTaggedGame(canonicalID, "parkour", PublishedLevelProductTag)
	if err != nil {
		t.Fatal(err)
	}
	if entry.ID != canonicalID {
		t.Fatalf("resolved id = %q, want canonical %q", entry.ID, canonicalID)
	}

	bundle.Catalog = bundle.Catalog[1:]
	bundle.Manifest.Runtime.Games = []string{"other-product", "another-product"}
	bundle.Catalog = append(bundle.Catalog, CatalogEntry{ID: "another-product", Aliases: []string{"parkour"}, Tags: []string{PublishedLevelProductTag}})
	if _, err := bundle.ResolveTaggedGame(canonicalID, "parkour", PublishedLevelProductTag); err == nil {
		t.Fatal("expected ambiguous mutable alias to be rejected")
	}
}

func TestResolveTaggedGameRequiresCapabilityTag(t *testing.T) {
	canonicalID := "4773837e-3565-49d7-8953-3b40f59fca7b"
	bundle := &Bundle{
		Manifest: Manifest{Runtime: BundleTarget{Games: []string{canonicalID}}},
		Catalog:  []CatalogEntry{{ID: canonicalID, Aliases: []string{"temporada-1"}, Tags: []string{"typescript"}}},
	}
	if _, err := bundle.ResolveTaggedGame(canonicalID, "temporada-1", PublishedLevelProductTag); err == nil {
		t.Fatal("expected product without published-levels capability to be rejected")
	}
}

func TestRunnerInitParamsCarriesContentAsJSONDocument(t *testing.T) {
	content := json.RawMessage(`{"schema":"motion-levels-published-level-content-v1","gameId":"c1daea4f-e586-4116-8cbe-871cde887a81"}`)
	params, err := runnerInitParams(Config{GameID: "c1daea4f-e586-4116-8cbe-871cde887a81", Content: content})
	if err != nil {
		t.Fatal(err)
	}
	encoded, err := json.Marshal(params)
	if err != nil {
		t.Fatal(err)
	}
	var decoded struct {
		Content struct {
			GameID string `json:"gameId"`
		} `json:"content"`
	}
	if err := json.Unmarshal(encoded, &decoded); err != nil {
		t.Fatal(err)
	}
	if decoded.Content.GameID != "c1daea4f-e586-4116-8cbe-871cde887a81" {
		t.Fatalf("content game id = %q", decoded.Content.GameID)
	}
	if _, err := runnerInitParams(Config{Content: json.RawMessage(`{"broken"`)}); err == nil {
		t.Fatal("expected malformed content to be rejected before runner init")
	}
}

func TestPinnedBundleVerifiesAndListsProductionGames(t *testing.T) {
	_, currentFile, _, _ := runtime.Caller(0)
	vendorRoot := filepath.Clean(filepath.Join(filepath.Dir(currentFile), "../../../../game-bundles/motion-levels-games"))
	bundle, err := Load(vendorRoot)
	if err != nil {
		t.Fatal(err)
	}
	if len(bundle.Manifest.SourceRevision) != 40 {
		t.Fatalf("revision = %q", bundle.Manifest.SourceRevision)
	}
	if !contains(bundle.Manifest.Runtime.Games, "ping-pong") || !contains(bundle.Manifest.Runtime.Games, "arkanoid") {
		t.Fatalf("production games = %v", bundle.Manifest.Runtime.Games)
	}
}

func TestPinnedRunnerStartsAndReturnsFrame(t *testing.T) {
	node, err := exec.LookPath("node")
	if err != nil {
		t.Skip("node is not installed")
	}
	_, currentFile, _, _ := runtime.Caller(0)
	vendorRoot := filepath.Clean(filepath.Join(filepath.Dir(currentFile), "../../../../game-bundles/motion-levels-games"))
	bundle, err := Load(vendorRoot)
	if err != nil {
		t.Fatal(err)
	}
	game, err := New(vendorRoot, Config{
		GameID: "ping-pong", ExpectedRevision: bundle.Manifest.SourceRevision,
		Seed: 137, PlayerCount: 0, Difficulty: "medium", NodeBinary: node,
	})
	if err != nil {
		t.Fatal(err)
	}
	defer game.Close()
	frame := game.Render(time.Now().Add(20 * time.Millisecond))
	if len(frame) != 16*32 {
		t.Fatalf("frame length = %d", len(frame))
	}
	if snapshot := game.Snapshot(); snapshot.CurrentGame != "ping-pong" || snapshot.PlayerCount != 0 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}
