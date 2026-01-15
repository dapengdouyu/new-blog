import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import qiniu from "qiniu";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * 加载 .env 文件
 */
async function loadEnvFile() {
  const envPath = path.join(projectRoot, ".env");
  try {
    const content = await fs.readFile(envPath, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      // 跳过空行和注释
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      // 解析 KEY=VALUE 格式
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // 移除引号（如果存在）
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 只在环境变量不存在时设置（环境变量优先级更高）
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // .env 文件不存在时忽略错误
    if (error.code !== "ENOENT") {
      console.warn(`Warning: Failed to load .env file: ${error.message}`);
    }
  }
}

const REQUIRED_ENV = [
  "QINIU_ACCESS_KEY",
  "QINIU_SECRET_KEY",
  "QINIU_BUCKET",
  "QINIU_REGION",
];

function assertEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env: ${missing.join(", ")}`);
  }
}

function resolveZone(region) {
  const normalized = region.toLowerCase();
  const zoneMap = new Map([
    ["z0", qiniu.zone.Zone_z0],
    ["z1", qiniu.zone.Zone_z1],
    ["z2", qiniu.zone.Zone_z2],
    ["na0", qiniu.zone.Zone_na0],
    ["as0", qiniu.zone.Zone_as0],
  ]);

  const zone = zoneMap.get(normalized);
  if (!zone) {
    throw new Error(
      `Unsupported QINIU_REGION "${region}". Use one of: ${[
        ...zoneMap.keys(),
      ].join(", ")}`
    );
  }

  return zone;
}

function resolvePrefix(prefix) {
  if (!prefix) return "";
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

async function listFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function uploadFiles({ bucket, zone, distDir, prefix }) {
  const mac = new qiniu.auth.digest.Mac(
    process.env.QINIU_ACCESS_KEY,
    process.env.QINIU_SECRET_KEY
  );
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    insertOnly: 0,
  });
  const uploadToken = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config({ zone });
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  const files = await listFiles(distDir);
  if (!files.length) {
    throw new Error(`No files found in ${distDir}`);
  }

  const concurrency = 5;
  let active = 0;
  let index = 0;

  return new Promise((resolve, reject) => {
    const results = [];

    const schedule = () => {
      if (index >= files.length && active === 0) {
        resolve(results);
        return;
      }

      while (active < concurrency && index < files.length) {
        const filePath = files[index];
        index += 1;
        active += 1;

        const key = `${prefix}${path
          .relative(distDir, filePath)
          .split(path.sep)
          .join("/")}`;

        formUploader.putFile(uploadToken, key, filePath, putExtra, (err, body) => {
          active -= 1;

          if (err) {
            reject(err);
            return;
          }

          results.push({ key, hash: body?.hash });
          schedule();
        });
      }
    };

    schedule();
  });
}

async function main() {
  // 先加载 .env 文件
  await loadEnvFile();

  assertEnv();

  const distDir = path.resolve(
    process.env.QINIU_DIST_DIR || "docs/.vitepress/dist"
  );
  const prefix = resolvePrefix(process.env.QINIU_UPLOAD_PREFIX);
  const bucket = process.env.QINIU_BUCKET;
  const zone = resolveZone(process.env.QINIU_REGION);

  await uploadFiles({ bucket, zone, distDir, prefix });
  console.log(`Uploaded ${distDir} to Qiniu bucket ${bucket}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
