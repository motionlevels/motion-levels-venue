package motionlevelsgames

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
)

type Pin struct {
	Schema         string `json:"schema"`
	SourceRevision string `json:"sourceRevision"`
	ArtifactDigest string `json:"artifactDigest"`
	BundlePath     string `json:"bundlePath"`
}

type BundleFile struct {
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
	Bytes  int64  `json:"bytes"`
}

type Manifest struct {
	Schema                string       `json:"schema"`
	ContractVersion       int          `json:"contractVersion"`
	RunnerProtocolVersion int          `json:"runnerProtocolVersion"`
	SourceRevision        string       `json:"sourceRevision"`
	SDKFPS                int          `json:"sdkFps"`
	ArtifactDigest        string       `json:"artifactDigest"`
	Runtime               BundleTarget `json:"runtime"`
	PlayerDisplay         BundleTarget `json:"playerDisplay"`
	Catalog               string       `json:"catalog"`
	Files                 []BundleFile `json:"files"`
}

type BundleTarget struct {
	Entry string   `json:"entry"`
	Games []string `json:"games"`
}

type CatalogEntry struct {
	ID          string `json:"id"`
	EngineGame  string `json:"engineGame"`
	Label       string `json:"label"`
	Description string `json:"description"`
	Players     struct {
		AllowAny bool `json:"allowAny"`
		Min      int  `json:"min"`
		Max      int  `json:"max"`
	} `json:"players"`
	Config struct {
		Difficulty struct {
			Options []string `json:"options"`
		} `json:"difficulty"`
	} `json:"config"`
}

type Bundle struct {
	Root     string
	Manifest Manifest
	Catalog  []CatalogEntry
}

func (b *Bundle) SupportsGame(gameID string) bool {
	return b != nil && contains(b.Manifest.Runtime.Games, gameID)
}

var bundleCache sync.Map

func Load(vendorRoot string) (*Bundle, error) {
	vendorRoot = strings.TrimSpace(vendorRoot)
	if vendorRoot == "" {
		return nil, fmt.Errorf("motion-levels-games bundle root is empty")
	}
	absRoot, err := filepath.Abs(vendorRoot)
	if err != nil {
		return nil, err
	}
	if cached, ok := bundleCache.Load(absRoot); ok {
		return cached.(*Bundle), nil
	}
	bundle, err := loadAndVerify(absRoot)
	if err != nil {
		return nil, err
	}
	actual, _ := bundleCache.LoadOrStore(absRoot, bundle)
	return actual.(*Bundle), nil
}

func loadAndVerify(vendorRoot string) (*Bundle, error) {
	var pin Pin
	if err := readJSON(filepath.Join(vendorRoot, "pin.json"), &pin); err != nil {
		return nil, err
	}
	if pin.Schema != "motion-levels-games-pin-v1" || pin.BundlePath == "" || pin.BundlePath != pin.SourceRevision {
		return nil, fmt.Errorf("invalid motion-levels-games pin")
	}
	root := filepath.Join(vendorRoot, pin.BundlePath)
	var manifest Manifest
	if err := readJSON(filepath.Join(root, "bundle.json"), &manifest); err != nil {
		return nil, err
	}
	if manifest.Schema != "motion-levels-games-bundle-v1" || manifest.ContractVersion != 1 || manifest.RunnerProtocolVersion != 1 || manifest.SDKFPS != 50 {
		return nil, fmt.Errorf("unsupported motion-levels-games bundle contract")
	}
	if manifest.SourceRevision != pin.SourceRevision || manifest.ArtifactDigest != pin.ArtifactDigest {
		return nil, fmt.Errorf("motion-levels-games pin does not match bundle")
	}
	files := append([]BundleFile(nil), manifest.Files...)
	sort.Slice(files, func(i, j int) bool { return files[i].Path < files[j].Path })
	hash := sha256.New()
	for _, file := range files {
		contents, err := os.ReadFile(filepath.Join(root, filepath.FromSlash(file.Path)))
		if err != nil {
			return nil, err
		}
		sum := sha256.Sum256(contents)
		if int64(len(contents)) != file.Bytes || hex.EncodeToString(sum[:]) != file.SHA256 {
			return nil, fmt.Errorf("motion-levels-games file mismatch: %s", file.Path)
		}
		fmt.Fprintf(hash, "%s\x00%s\x00%d\n", file.Path, file.SHA256, file.Bytes)
	}
	if hex.EncodeToString(hash.Sum(nil)) != manifest.ArtifactDigest {
		return nil, fmt.Errorf("motion-levels-games artifact digest mismatch")
	}
	var catalog []CatalogEntry
	if err := readJSON(filepath.Join(root, filepath.FromSlash(manifest.Catalog)), &catalog); err != nil {
		return nil, err
	}
	return &Bundle{Root: root, Manifest: manifest, Catalog: catalog}, nil
}

func readJSON(filePath string, target any) error {
	contents, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(contents, target); err != nil {
		return fmt.Errorf("%s: %w", filePath, err)
	}
	return nil
}
