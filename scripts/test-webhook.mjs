/**
 * LINE Webhook 署名検証のテストスクリプト
 * 実行: node scripts/test-webhook.mjs
 */
import crypto from "crypto";

const CHANNEL_SECRET = "test_secret_key";

function createSignature(body, secret) {
  return crypto.createHmac("SHA256", secret).update(body).digest("base64");
}

const testBody = JSON.stringify({
  events: [
    {
      type: "message",
      replyToken: "test-reply-token",
      source: { userId: "U1234567890", type: "user" },
      message: { type: "text", text: "営業時間は？" },
    },
  ],
});

const signature = createSignature(testBody, CHANNEL_SECRET);

console.log("=== LINE Webhook テスト用データ ===");
console.log("Body:", testBody);
console.log("Signature:", signature);
console.log("");
console.log("curl テスト例:");
console.log(`curl -X POST http://localhost:3000/api/webhook/line \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -H "x-line-signature: ${signature}" \\`);
console.log(`  -d '${testBody}'`);

// 署名検証ロジックの単体テスト
const valid = createSignature(testBody, CHANNEL_SECRET) === signature;
const invalid = createSignature(testBody, "wrong_secret") === signature;

console.log("");
console.log("=== 署名検証テスト ===");
console.log("正しい署名:", valid ? "PASS" : "FAIL");
console.log("不正な署名:", !invalid ? "PASS" : "FAIL");
