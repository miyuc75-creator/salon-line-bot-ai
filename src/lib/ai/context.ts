import { createAdminClient } from "@/lib/supabase/admin";
import type { Faq, Menu } from "@/types/database";

const FALLBACK_FAQS: Faq[] = [
  {
    id: "1",
    question: "営業時間を教えてください",
    answer: "平日 10:00〜19:00、土日祝 9:00〜18:00 です。",
    category: "営業時間",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    question: "定休日はいつですか？",
    answer: "毎週火曜日と第3水曜日が定休日です。",
    category: "営業時間",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    question: "予約方法を教えてください",
    answer:
      "LINE、お電話（03-1234-5678）、またはホットペッパービューティーからご予約いただけます。",
    category: "予約",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    question: "駐車場はありますか？",
    answer:
      "店舗前に3台分の無料駐車場がございます。満車の場合は近隣のコインパーキングをご利用ください。",
    category: "アクセス",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    question: "パーマとカラーは同時にできますか？",
    answer:
      "髪の状態によりますが、基本的には同日施術可能です。詳しくはご来店時にスタイリストがご相談に応じます。",
    category: "施術",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

const FALLBACK_MENUS: Menu[] = [
  { id: "1", name: "カット", price: 5500, description: "シャンプー・ブロー込み", is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "カラー", price: 7700, description: "トリートメント込み", is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "パーマ", price: 8800, description: "カット・ブロー込み", is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "カット + カラー", price: 12100, description: "セットメニュー", is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "カット + パーマ", price: 13200, description: "セットメニュー", is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "トリートメント", price: 3300, description: "ダメージケア", is_active: true, created_at: "", updated_at: "" },
];

export type BotContext = {
  faqs: Faq[];
  menus: Menu[];
};

export async function fetchBotContext(): Promise<BotContext> {
  try {
    const supabase = createAdminClient();

    const [faqResult, menuResult] = await Promise.all([
      supabase.from("faqs").select("*").eq("is_active", true),
      supabase.from("menus").select("*").eq("is_active", true),
    ]);

    const faqs = faqResult.data?.length ? faqResult.data : FALLBACK_FAQS;
    const menus = menuResult.data?.length ? menuResult.data : FALLBACK_MENUS;

    return { faqs, menus };
  } catch (error) {
    console.error("[Context] Failed to fetch from Supabase, using fallback:", error);
    return { faqs: FALLBACK_FAQS, menus: FALLBACK_MENUS };
  }
}

export function formatContextForPrompt(context: BotContext): string {
  const faqText = context.faqs
    .map(
      (f) =>
        `- [${f.category ?? "その他"}] Q: ${f.question}\n  A: ${f.answer}`
    )
    .join("\n");

  const menuText = context.menus
    .map(
      (m) =>
        `- ${m.name}: ${m.price.toLocaleString()}円${m.description ? `（${m.description}）` : ""}`
    )
    .join("\n");

  return `## FAQ一覧\n${faqText}\n\n## メニュー・料金\n${menuText}`;
}
