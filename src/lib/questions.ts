import type { Tier } from "./types";

/**
 * Bộ câu hỏi — 3 mức, mở dần theo đêm. Mức Cay chỉ mở sau vòng 7.
 * `topics` khớp với danh sách vùng cấm; câu dính chủ đề đã gạch sẽ bị loại.
 */
export type Question = { text: string; topics: string[] };

export const QUESTION_BANK: Record<Tier, Question[]> = {
  warm: [
    { text: "Tin nhắn cuối cùng bạn gửi cho ai đó là gì? Đọc lên.", topics: [] },
    { text: "Ứng dụng bạn dùng nhiều nhất tuần này?", topics: [] },
    { text: "Bạn từng nói dối để trốn một buổi hẹn chưa? Lần gần nhất là gì?", topics: [] },
    { text: "Món ăn bạn giả vờ thích để chiều lòng người khác?", topics: [] },
    { text: "Ai trong bàn này bạn quen lâu nhất, và ấn tượng đầu tiên về họ là gì?", topics: [] },
    { text: "Điều ngớ ngẩn nhất bạn từng tra Google?", topics: [] },
    { text: "Ảnh đại diện mạng xã hội nào của bạn mà bạn muốn xoá nhất?", topics: [] },
    { text: "Lần gần nhất bạn trốn trong nhà vệ sinh để lướt điện thoại là khi nào?", topics: [] },
    { text: "Món đồ ngốc nghếch nhất bạn từng mua online mà chưa dùng đến?", topics: [] },
    { text: "Món ăn kỳ quặc nhất bạn từng thử kết hợp là gì?", topics: [] },
    { text: "Ai trong bàn này có gu thời trang làm bạn thắc mắc nhất?", topics: [] },
    { text: "Nickname ngớ ngẩn nhất thời dùng Yahoo / Ola / Blog Plus của bạn là gì?", topics: [] },
    { text: "Bạn từng giả vờ nghe điện thoại để né tránh ai chưa?", topics: [] },
    { text: "Thói quen xấu nào khi ngủ mà bạn ngại thừa nhận nhất?", topics: [] },
    { text: "Bài hát nào bạn thích nghe lén nhưng không bao giờ dám bật trước mặt người khác?", topics: [] },
  ],
  mid: [
    { text: "Lời nói dối lớn nhất bạn từng nói với sếp/thầy cô?", topics: ["Công việc", "Học vấn"] },
    { text: "Bạn từng đọc trộm điện thoại người yêu chưa?", topics: [] },
    { text: "Số tiền lớn nhất bạn từng tiêu cho một thứ vô nghĩa?", topics: ["Tiền lương", "Nợ nần"] },
    { text: "Ai trong bàn này bạn từng nói xấu sau lưng? (không cần nói nội dung)", topics: [] },
    { text: "Điều bạn ghen tị nhất ở một người trong bàn này?", topics: [] },
    { text: "Bạn từng khóc vì chuyện gì mà giờ nghĩ lại thấy buồn cười?", topics: [] },
    { text: "Lần gần nhất bạn “seen” tin nhắn ai đó rồi cố tình không trả lời?", topics: [] },
    { text: "Số tiền bạn từng cho người khác vay mà biết chắc không lấy lại được?", topics: ["Nợ nần", "Tiền lương"] },
    { text: "Điều xui xẻo / ngốc nghếch nhất bạn từng làm khi say bia rượu?", topics: [] },
    { text: "Ai trong bàn này bạn nghĩ là người giữ bí mật kém nhất?", topics: [] },
    { text: "Bạn từng lấy lý do gì dối người yêu hoặc bạn bè để đi chơi riêng?", topics: ["Người yêu cũ có mặt"] },
    { text: "Lần gần nhất bạn dối gia đình về tiền bạc hoặc tình cảm là khi nào?", topics: ["Gia đình", "Tiền lương"] },
    { text: "Nếu phải huỷ kết bạn với 1 người trong bàn này, bạn chọn ai?", topics: [] },
    { text: "Mục tìm kiếm bí mật nhất trong lịch sử trình duyệt của bạn là gì?", topics: [] },
    { text: "Bạn từng giả vờ ốm để xin nghỉ làm / nghỉ học chưa?", topics: ["Công việc", "Học vấn"] },
    { text: "Lần gần nhất bạn lén vào xem trang cá nhân của người yêu cũ là khi nào?", topics: ["Người yêu cũ có mặt"] },
  ],
  spicy: [
    { text: "Bí mật bạn chưa từng kể cho ai trong bàn này?", topics: [] },
    { text: "Bạn từng thích ai trong bàn này chưa?", topics: [] },
    { text: "Điều bạn tiếc nhất trong một mối quan hệ cũ?", topics: ["Người yêu cũ có mặt"] },
    { text: "Nếu được xoá một chuyện trong quá khứ, bạn xoá chuyện gì?", topics: [] },
    { text: "Bạn nghĩ ấn tượng thật của mọi người về bạn khác thế nào so với con người thật?", topics: [] },
    { text: "Khai thật: Bạn từng nảy sinh tình cảm với người yêu của bạn mình chưa?", topics: ["Người yêu cũ có mặt"] },
    { text: "Nếu buộc phải hẹn hò với 1 người trong bàn này, bạn chọn ai và tại sao?", topics: [] },
    { text: "Kinh nghiệm hẹn hò / yêu đương thảm họa nhất đời bạn là gì?", topics: ["Người yêu cũ có mặt"] },
    { text: "Số tiền bạn đang nợ (hoặc bị nợ) mà chưa dám nói với ai?", topics: ["Nợ nần", "Tiền lương"] },
    { text: "Ai trong bàn này bạn nghĩ là người 'cáo già' nhất khi yêu?", topics: [] },
    { text: "Bí mật bựa nhất về bản thân mà nếu lộ ra bạn sẽ muốn chuyển nhà?", topics: [] },
    { text: "Lần gần nhất bạn khóc vì thất tình hoặc bị 'cắm sừng' là khi nào?", topics: ["Người yêu cũ có mặt"] },
    { text: "Chuyện kỳ quặc nhất bạn từng làm khi ở một mình trong phòng riêng?", topics: ["Chuyện giường"] },
    { text: "Nếu bàn này xảy ra tranh cãi lớn, bạn nghĩ ai sẽ là người châm ngòi?", topics: [] },
  ],
};

/** Biến thể "Cả bàn dính" — ai dính thì tự bấm trên phone. */
export const TABLE_PROMPTS: Question[] = [
  { text: "Ai từng ngủ gật trong cuộc họp / giờ học?", topics: ["Công việc", "Học vấn"] },
  { text: "Ai từng đi trễ rồi đổ tại kẹt xe / xe hỏng?", topics: [] },
  { text: "Ai còn nhắn tin hoặc xem story người yêu cũ?", topics: ["Người yêu cũ có mặt"] },
  { text: "Ai từng hát karaoke sai lời mà vẫn gào tiếp?", topics: [] },
  { text: "Ai chưa gọi về cho gia đình trong tuần này?", topics: ["Gia đình"] },
  { text: "Ai từng ăn vụng đồ trong tủ lạnh người khác?", topics: [] },
  { text: "Ai từng đi nhậu mà quên mang tiền / chuyển khoản thiếu?", topics: ["Nợ nần", "Tiền lương"] },
  { text: "Ai từng nhắn nhầm tin riêng tư vào nhóm chung?", topics: [] },
  { text: "Ai từng bấm lỡ thả tim bài viết từ vài năm trước của ai đó?", topics: [] },
  { text: "Ai từng mua hàng Shopee mẫu một đằng thật một nẻo?", topics: [] },
  { text: "Ai từng bị công an vẫy vào vì đi sai đường / không xin đường?", topics: [] },
];

const norm = (s: string) => s.trim().toLowerCase();

/** Loại câu dính vùng cấm và câu đã dùng. */
export function pickQuestions(
  tier: Tier,
  bannedTopics: string[],
  used: string[],
  count: number,
  seed: number,
): string[] {
  const usedSet = new Set(used.map(norm));
  const pool = QUESTION_BANK[tier].filter(
    (q) =>
      !usedSet.has(norm(q.text)) &&
      !q.topics.some((t) => bannedTopics.includes(t)),
  );
  // Hết câu ở mức này thì mở lại toàn bộ mức (vẫn tôn trọng vùng cấm).
  const source =
    pool.length >= count
      ? pool
      : QUESTION_BANK[tier].filter(
          (q) => !q.topics.some((t) => bannedTopics.includes(t)),
        );
  if (source.length === 0) return [];

  const out: string[] = [];
  for (let i = 0; out.length < count && i < source.length * 2; i++) {
    const q = source[(seed + i * 3) % source.length];
    if (!out.includes(q.text)) out.push(q.text);
  }
  return out;
}

export function pickTablePrompt(
  bannedTopics: string[],
  used: string[],
  seed: number,
): string {
  const usedSet = new Set(used.map(norm));
  const pool = TABLE_PROMPTS.filter(
    (q) => !q.topics.some((t) => bannedTopics.includes(t)),
  );
  const fresh = pool.filter((q) => !usedSet.has(norm(q.text)));
  const source = fresh.length ? fresh : pool;
  return source.length ? source[seed % source.length].text : TABLE_PROMPTS[1].text;
}
