const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const pkgPath = path.join(rootDir, "package.json");
const pkgLockPath = path.join(rootDir, "package-lock.json");
const sidebarPath = path.join(rootDir, "src", "components", "admin", "AdminSidebar.tsx");
const versionInfoPath = path.join(rootDir, "data", "version-info.json");

// 1. Read package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const currentVersion = pkg.version || "1.0.1";
const parts = currentVersion.split(".").map(Number);
parts[2] = (parts[2] || 0) + 1;
const newVersion = parts.join(".");

console.log(`Bumping version: v${currentVersion} -> v${newVersion}`);

// 2. Update package.json
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

// 3. Update package-lock.json if exists
if (fs.existsSync(pkgLockPath)) {
  try {
    const pkgLock = JSON.parse(fs.readFileSync(pkgLockPath, "utf8"));
    pkgLock.version = newVersion;
    if (pkgLock.packages && pkgLock.packages[""]) {
      pkgLock.packages[""].version = newVersion;
    }
    fs.writeFileSync(pkgLockPath, JSON.stringify(pkgLock, null, 2) + "\n", "utf8");
  } catch (e) {
    console.warn("Could not update package-lock.json:", e.message);
  }
}

// 4. Update AdminSidebar.tsx badge
if (fs.existsSync(sidebarPath)) {
  let sidebarContent = fs.readFileSync(sidebarPath, "utf8");
  sidebarContent = sidebarContent.replace(
    /badge:\s*"v\d+\.\d+\.\d+"/,
    `badge: "v${newVersion}"`
  );
  fs.writeFileSync(sidebarPath, sidebarContent, "utf8");
}

// 5. Update data/version-info.json
try {
  let versionInfo = {};
  if (fs.existsSync(versionInfoPath)) {
    try {
      versionInfo = JSON.parse(fs.readFileSync(versionInfoPath, "utf8"));
    } catch {}
  }
  versionInfo.version = newVersion;
  versionInfo.updatedAt = new Date().toISOString();
  fs.writeFileSync(versionInfoPath, JSON.stringify(versionInfo, null, 2) + "\n", "utf8");
} catch (e) {
  console.warn("Could not update version-info.json:", e.message);
}

console.log(`Successfully bumped to v${newVersion}`);
