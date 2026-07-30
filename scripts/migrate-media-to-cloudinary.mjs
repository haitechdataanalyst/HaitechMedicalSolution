// One-off migration: upload public/images, public/BrandLogo, and public/Camera
// to Cloudinary, then rewrite every matching local path in data/*.json to the
// resulting Cloudinary URL.
//
// Usage: npm run migrate:cloudinary
// Requires CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
// in .env.local (see .env.local.example). Safe to re-run — already-uploaded
// files are skipped via the map at scripts/.cloudinary-upload-map.json.
// Does NOT delete local files or touch anything outside data/*.json.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvLocal() {
    const envPath = path.join(ROOT, ".env.local");
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!(key in process.env)) process.env[key] = value;
    }
}
loadEnvLocal();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error("Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET — set them in .env.local (see .env.local.example).");
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const MEDIA_DIRS = ["images", "BrandLogo", "Camera"].map((d) => path.join(ROOT, "public", d));
const MAP_PATH = path.join(__dirname, ".cloudinary-upload-map.json");
const DATA_FILES = ["products.json", "categories.json", "frames.json", "headlights.json", "medesy.json"]
    .map((f) => path.join(ROOT, "data", f));

function loadMap() {
    if (!fs.existsSync(MAP_PATH)) return {};
    return JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
}

function saveMap(map) {
    fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 4));
}

function walk(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { recursive: true })
        .map((rel) => path.join(dir, rel))
        .filter((full) => fs.statSync(full).isFile());
}

// Cloudinary public_id: lowercase, hyphenated — cosmetic/organizational only,
// never used for matching against data/*.json (that uses the exact web path).
function toPublicId(localPath) {
    const relFromPublic = path.relative(path.join(ROOT, "public"), localPath).replace(/\\/g, "/");
    const noExt = relFromPublic.replace(/\.[^./]+$/, "");
    return (
        "haitech/" +
        noExt
            .toLowerCase()
            .replace(/[^a-z0-9/]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/(^-|-$)/g, "")
    );
}

// The exact string data/*.json references, e.g. "/images/products/admetec/x.jpg"
function toWebPath(localPath) {
    return "/" + path.relative(path.join(ROOT, "public"), localPath).replace(/\\/g, "/");
}

async function uploadAll() {
    const map = loadMap();
    const files = MEDIA_DIRS.flatMap(walk);
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const localPath of files) {
        const webPath = toWebPath(localPath);
        if (map[webPath]) {
            skipped++;
            continue;
        }

        const publicId = toPublicId(localPath);
        try {
            const result = await cloudinary.uploader.upload(localPath, {
                public_id: publicId,
                resource_type: "auto",
                overwrite: false,
            });
            map[webPath] = { url: result.secure_url, publicId: result.public_id };
            saveMap(map); // flush after every file — a crash mid-run loses at most one upload
            uploaded++;
            console.log(`  uploaded: ${webPath}`);
        } catch (err) {
            failed++;
            console.error(`  FAILED: ${webPath} — ${err.message}`);
        }
    }

    console.log(`\nUploaded ${uploaded}, skipped ${skipped} (already migrated), ${failed} failed.`);
    return map;
}

function deepReplace(value, map, stats) {
    if (typeof value === "string") {
        const hit = map[value];
        if (hit) {
            stats.replacements++;
            return hit.url;
        }
        if (value.startsWith("/images/") || value.startsWith("/BrandLogo/") || value.startsWith("/Camera/")) {
            stats.missing.add(value);
        }
        return value;
    }
    if (Array.isArray(value)) return value.map((v) => deepReplace(v, map, stats));
    if (value && typeof value === "object") {
        const out = {};
        for (const [k, v] of Object.entries(value)) out[k] = deepReplace(v, map, stats);
        return out;
    }
    return value;
}

function rewriteDataFiles(map) {
    const missing = new Set();
    let totalReplacements = 0;

    for (const filePath of DATA_FILES) {
        if (!fs.existsSync(filePath)) continue;
        const before = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(before);
        const stats = { replacements: 0, missing };
        const rewritten = deepReplace(data, map, stats);
        totalReplacements += stats.replacements;
        const after = JSON.stringify(rewritten, null, 4) + "\n";
        if (after !== before) {
            fs.writeFileSync(filePath, after);
        }
        console.log(`  ${path.basename(filePath)}: ${stats.replacements} replacement(s)`);
    }

    return { totalReplacements, missing };
}

async function main() {
    console.log("Uploading media to Cloudinary…");
    const map = await uploadAll();

    console.log("\nRewriting data/*.json…");
    const { totalReplacements, missing } = rewriteDataFiles(map);

    console.log(`\nTotal replacements: ${totalReplacements}`);
    if (missing.size > 0) {
        console.log(`\n${missing.size} local image path(s) referenced in data but not uploaded/found:`);
        for (const m of missing) console.log(`  - ${m}`);
    } else {
        console.log("No broken references — every local image path in data/*.json was migrated.");
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
