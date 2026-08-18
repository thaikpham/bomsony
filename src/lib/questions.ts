import type { Tier } from "./types";
import type { Language } from "./i18n";

/**
 * Bộ câu hỏi — 3 mức, mở dần theo đêm. Mức Cay chỉ mở sau vòng 7.
 * `topics` khớp với danh sách vùng cấm; câu dính chủ đề đã gạch sẽ bị loại.
 */
export type Question = { text: string; textEn?: string; topics: string[] };

export const QUESTION_BANK: Record<Tier, Question[]> = {
  warm: [
    {
      text: "Tin nhắn cuối cùng bạn gửi cho ai đó là gì? Đọc lên.",
      textEn: "What was the last text message you sent to someone? Read it out loud.",
      topics: [],
    },
    {
      text: "Ứng dụng bạn dùng nhiều nhất tuần này?",
      textEn: "Which app did you use the most this week?",
      topics: [],
    },
    {
      text: "Bạn từng nói dối để trốn một buổi hẹn chưa? Lần gần nhất là gì?",
      textEn: "Have you ever lied to get out of a hang out? What was the last time?",
      topics: [],
    },
    {
      text: "Món ăn bạn giả vờ thích để chiều lòng người khác?",
      textEn: "A food you pretend to like just to please someone else?",
      topics: [],
    },
    {
      text: "Ai trong bàn này bạn quen lâu nhất, và ấn tượng đầu tiên về họ là gì?",
      textEn: "Who at this table have you known the longest, and what was your first impression of them?",
      topics: [],
    },
    {
      text: "Điều ngớ ngẩn nhất bạn từng tra Google?",
      textEn: "What is the dumbest thing you have ever googled?",
      topics: [],
    },
    {
      text: "Ảnh đại diện mạng xã hội nào của bạn mà bạn muốn xoá nhất?",
      textEn: "Which of your social media profile pictures do you wish you could delete forever?",
      topics: [],
    },
    {
      text: "Lần gần nhất bạn trốn trong nhà vệ sinh để lướt điện thoại là khi nào?",
      textEn: "When was the last time you hid in the bathroom just to scroll on your phone?",
      topics: [],
    },
    {
      text: "Món đồ ngốc nghếch nhất bạn từng mua online mà chưa dùng đến?",
      textEn: "What's the sillest item you bought online that you've never used?",
      topics: [],
    },
    {
      text: "Món ăn kỳ quặc nhất bạn từng thử kết hợp là gì?",
      textEn: "What's the weirdest food combo you have ever tried?",
      topics: [],
    },
    {
      text: "Ai trong bàn này có gu thời trang làm bạn thắc mắc nhất?",
      textEn: "Who at this table has a fashion sense that confuses you the most?",
      topics: [],
    },
    {
      text: "Nickname ngớ ngẩn nhất thời dùng Yahoo / Ola / Blog Plus của bạn là gì?",
      textEn: "What was your most embarrassing old username or screen name?",
      topics: [],
    },
    {
      text: "Bạn từng giả vờ nghe điện thoại để né tránh ai chưa?",
      textEn: "Have you ever pretended to be on a call to avoid someone?",
      topics: [],
    },
    {
      text: "Thói quen xấu nào khi ngủ mà bạn ngại thừa nhận nhất?",
      textEn: "What is a bad sleep habit you're embarrassed to admit?",
      topics: [],
    },
    {
      text: "Bài hát nào bạn thích nghe lén nhưng không bao giờ dám bật trước mặt người khác?",
      textEn: "What song is your secret guilty pleasure that you'd never play out loud?",
      topics: [],
    },
  ],
  mid: [
    {
      text: "Lời nói dối lớn nhất bạn từng nói với sếp/thầy cô?",
      textEn: "What's the biggest lie you've ever told your boss or teacher?",
      topics: ["Công việc", "Học vấn"],
    },
    {
      text: "Bạn từng đọc trộm điện thoại người yêu chưa?",
      textEn: "Have you ever secretly snooped through a partner's phone?",
      topics: [],
    },
    {
      text: "Số tiền lớn nhất bạn từng tiêu cho một thứ vô nghĩa?",
      textEn: "What's the largest amount of money you spent on something useless?",
      topics: ["Tiền lương", "Nợ nần"],
    },
    {
      text: "Ai trong bàn này bạn từng nói xấu sau lưng? (không cần nói nội dung)",
      textEn: "Who at this table have you talked about behind their back? (No details needed)",
      topics: [],
    },
    {
      text: "Điều bạn ghen tị nhất ở một người trong bàn này?",
      textEn: "What is something you are most jealous of regarding someone at this table?",
      topics: [],
    },
    {
      text: "Bạn từng khóc vì chuyện gì mà giờ nghĩ lại thấy buồn cười?",
      textEn: "What is something you cried over that seems hilarious looking back?",
      topics: [],
    },
    {
      text: "Lần gần nhất bạn “seen” tin nhắn ai đó rồi cố tình không trả lời?",
      textEn: "When was the last time you intentionally left someone on read?",
      topics: [],
    },
    {
      text: "Số tiền bạn từng cho người khác vay mà biết chắc không lấy lại được?",
      textEn: "How much money did you lend someone knowing you'd never get it back?",
      topics: ["Nợ nần", "Tiền lương"],
    },
    {
      text: "Điều xui xẻo / ngốc nghếch nhất bạn từng làm khi say bia rượu?",
      textEn: "What is the dumbest thing you've ever done while drunk?",
      topics: [],
    },
    {
      text: "Ai trong bàn này bạn nghĩ là người giữ bí mật kém nhất?",
      textEn: "Who at this table do you think is worst at keeping secrets?",
      topics: [],
    },
    {
      text: "Bạn từng lấy lý do gì dối người yêu hoặc bạn bè để đi chơi riêng?",
      textEn: "What excuse did you use to lie to friends or a partner to go out alone?",
      topics: ["Người yêu cũ có mặt"],
    },
    {
      text: "Lần gần nhất bạn dối gia đình về tiền bạc hoặc tình cảm là khi nào?",
      textEn: "When was the last time you lied to family about money or relationships?",
      topics: ["Gia đình", "Tiền lương"],
    },
    {
      text: "Nếu phải huỷ kết bạn với 1 người trong bàn này, bạn chọn ai?",
      textEn: "If you had to unfriend one person at this table, who would it be?",
      topics: [],
    },
    {
      text: "Mục tìm kiếm bí mật nhất trong lịch sử trình duyệt của bạn là gì?",
      textEn: "What is the most secret search query in your browser history?",
      topics: [],
    },
    {
      text: "Bạn từng giả vờ ốm để xin nghỉ làm / nghỉ học chưa?",
      textEn: "Have you ever faked an illness to call in sick for work or school?",
      topics: ["Công việc", "Học vấn"],
    },
    {
      text: "Lần gần nhất bạn lén vào xem trang cá nhân của người yêu cũ là khi nào?",
      textEn: "When was the last time you stalked your ex's social media profile?",
      topics: ["Người yêu cũ có mặt"],
    },
  ],
  spicy: [
    {
      text: "Bí mật bạn chưa từng kể cho ai trong bàn này?",
      textEn: "What is a secret you've never told anyone at this table?",
      topics: [],
    },
    {
      text: "Bạn từng thích ai trong bàn này chưa?",
      textEn: "Have you ever had a crush on someone at this table?",
      topics: [],
    },
    {
      text: "Điều bạn tiếc nhất trong một mối quan hệ cũ?",
      textEn: "What is your biggest regret from a past relationship?",
      topics: ["Người yêu cũ có mặt"],
    },
    {
      text: "Nếu được xoá một chuyện trong quá khứ, bạn xoá chuyện gì?",
      textEn: "If you could erase one thing from your past, what would it be?",
      topics: [],
    },
    {
      text: "Bạn nghĩ ấn tượng thật của mọi người về bạn khác thế nào so với con người thật?",
      textEn: "How do you think people's first impression of you differs from who you truly are?",
      topics: [],
    },
    {
      text: "Khai thật: Bạn từng nảy sinh tình cảm với người yêu của bạn mình chưa?",
      textEn: "Be honest: Have you ever developed feelings for a friend's partner?",
      topics: ["Người yêu cũ có mặt"],
    },
    {
      text: "Nếu buộc phải hẹn hò với 1 người trong bàn này, bạn chọn ai và tại sao?",
      textEn: "If forced to date someone at this table, who would you pick and why?",
      topics: [],
    },
    {
      text: "Kinh nghiệm hẹn hò / yêu đương thảm họa nhất đời bạn là gì?",
      textEn: "What was the most disastrous date of your life?",
      topics: ["Người yêu cũ có mặt"],
    },
    {
      text: "Số tiền bạn đang nợ (hoặc bị nợ) mà chưa dám nói với ai?",
      textEn: "How much money do you currently owe (or are owed) that you haven't told anyone?",
      topics: ["Nợ nần", "Tiền lương"],
    },
    {
      text: "Ai trong bàn này bạn nghĩ là người 'cáo giả' nhất khi yêu?",
      textEn: "Who at this table do you think is the slyest or most manipulative when dating?",
      topics: [],
    },
    {
      text: "Bí mật bựa nhất về bản thân mà nếu lộ ra bạn sẽ muốn chuyển nhà?",
      textEn: "What's the most embarrassing personal secret that would make you want to move away if exposed?",
      topics: [],
    },
    {
      text: "Lần gần nhất bạn khóc vì thất tình hoặc bị 'cắm sừng' là khi nào?",
      textEn: "When was the last time you cried over heartbreak or getting cheated on?",
      topics: ["Người yêu cũ có mặt"],
    },
    {
      text: "Chuyện kỳ quặc nhất bạn từng làm khi ở một mình trong phòng riêng?",
      textEn: "What is the weirdest thing you've ever done alone in your private room?",
      topics: ["Chuyện giường"],
    },
    {
      text: "Nếu bàn này xảy ra tranh cãi lớn, bạn nghĩ ai sẽ là người châm ngòi?",
      textEn: "If a huge argument broke out at this table, who would be the one to spark it?",
      topics: [],
    },
  ],
};

/** Biến thể "Cả bàn dính" — ai dính thì tự bấm trên phone. */
export const TABLE_PROMPTS: Question[] = [
  {
    text: "Ai từng ngủ gật trong cuộc họp / giờ học?",
    textEn: "Who has ever fallen asleep during a meeting or class?",
    topics: ["Công việc", "Học vấn"],
  },
  {
    text: "Ai từng đi trễ rồi đổ tại kẹt xe / xe hỏng?",
    textEn: "Who has ever arrived late and blamed traffic or a broken vehicle?",
    topics: [],
  },
  {
    text: "Ai còn nhắn tin hoặc xem story người yêu cũ?",
    textEn: "Who still texts or views their ex's stories?",
    topics: ["Người yêu cũ có mặt"],
  },
  {
    text: "Ai từng hát karaoke sai lời mà vẫn gào tiếp?",
    textEn: "Who has ever sung karaoke with completely wrong lyrics and kept screaming anyway?",
    topics: [],
  },
  {
    text: "Ai chưa gọi về cho gia đình trong tuần này?",
    textEn: "Who hasn't called their family yet this week?",
    topics: ["Gia đình"],
  },
  {
    text: "Ai từng ăn vụng đồ trong tủ lạnh người khác?",
    textEn: "Who has ever stolen food from someone else's fridge?",
    topics: [],
  },
  {
    text: "Ai từng đi nhậu mà quên mang tiền / chuyển khoản thiếu?",
    textEn: "Who went out drinking and forgot their wallet or transferred short amount?",
    topics: ["Nợ nần", "Tiền lương"],
  },
  {
    text: "Ai từng nhắn nhầm tin riêng tư vào nhóm chung?",
    textEn: "Who accidentally sent a private text to a group chat?",
    topics: [],
  },
  {
    text: "Ai từng bấm lỡ thả tim bài viết từ vài năm trước của ai đó?",
    textEn: "Who accidentally liked a post from years ago while stalking someone?",
    topics: [],
  },
  {
    text: "Ai từng mua hàng Shopee mẫu một đằng thật một nẻo?",
    textEn: "Who bought something online that looked totally different in real life?",
    topics: [],
  },
  {
    text: "Ai từng bị công an vẫy vào vì đi sai đường / không xin đường?",
    textEn: "Who has been pulled over by traffic police for missing a turn signal or wrong lane?",
    topics: [],
  },
];

const norm = (s: string) => s.trim().toLowerCase();

/** Trả về danh sách câu hỏi. */
export function pickQuestions(
  tier: Tier,
  bannedTopics: string[],
  used: string[],
  count: number,
  seed: number,
): Question[] {
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

  const out: Question[] = [];
  for (let i = 0; out.length < count && i < source.length * 2; i++) {
    const q = source[(seed + i * 3) % source.length];
    if (!out.some((x) => x.text === q.text)) out.push(q);
  }
  return out;
}

export function pickTablePrompt(
  bannedTopics: string[],
  used: string[],
  seed: number,
): Question {
  const usedSet = new Set(used.map(norm));
  const pool = TABLE_PROMPTS.filter(
    (q) => !q.topics.some((t) => bannedTopics.includes(t)),
  );
  const fresh = pool.filter((q) => !usedSet.has(norm(q.text)));
  const source = fresh.length ? fresh : pool;
  return source.length ? source[seed % source.length] : TABLE_PROMPTS[1];
}

export function getQuestionText(q: Question | string | null, lang: Language = "vi"): string {
  if (!q) return "";
  if (typeof q === "string") return q;
  if (lang === "en" && q.textEn) return q.textEn;
  return q.text;
}
