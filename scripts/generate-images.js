const sharp = require("sharp");
const path = require("path");

const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f5fbf"/>
      <stop offset="100%" stop-color="#123a73"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="80" y="90" width="96" height="96" rx="22" fill="#ffffff"/>
  <text x="128" y="156" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#1f5fbf" text-anchor="middle">TF</text>
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#ffffff">TramitesFacil</text>
  <text x="80" y="360" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#dbe6fb">Guias de visas y tramites migratorios para colombianos</text>
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#9fbceb">tramitesfacil.co</text>
</svg>
`;

const iconSvg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#1f5fbf"/>
  <text x="256" y="336" font-family="Arial, Helvetica, sans-serif" font-size="220" font-weight="700" fill="#ffffff" text-anchor="middle">TF</text>
</svg>
`;

async function main() {
  const outDir = path.join(__dirname, "..", "src");

  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(outDir, "og-image.png"));
  console.log("Wrote og-image.png");

  await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(path.join(outDir, "apple-touch-icon.png"));
  console.log("Wrote apple-touch-icon.png");

  await sharp(Buffer.from(iconSvg)).resize(32, 32).png().toFile(path.join(outDir, "favicon-32.png"));
  console.log("Wrote favicon-32.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
