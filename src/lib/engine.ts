import {
  DEFAULT_BANNED,
  DOSE_LABEL,
  GLASSES_PER_SIP,
  type Dose,
  type Mode,
  type Player,
  type Room,
  type Round,
  type VoteValue,
} from "./types";
import { pickQuestions, pickTablePrompt } from "./questions";
import {
  ROUNDS_PER_GAME,
  pickSpotlight,
  roundTypeFor,
  tierFor,
} from "./schedule";
import { makeVerdict, mergeDose } from "./verdicts";
import { isValidBirthDate, isClash, lifePathOf, zodiacOf } from "./zodiac";

export type Action =
  | { t: "setMode"; mode: Mode }
  | { t: "setSafety"; bannedTopics: string[] }
  | { t: "startGame" }
  | { t: "join"; playerId: string; name: string; avatarUrl?: string | null }
  | { t: "presence"; playerId: string; connected: boolean }
  | { t: "setBirthDate"; playerId: string; birthDate: string }
  | { t: "drink"; playerId: string }
  | { t: "appeal"; playerId: string }
  | { t: "push"; playerId: string; targetId: string }
  | { t: "duel"; playerId: string }
  | { t: "flipLuck"; playerId: string }
  | { t: "clashResult"; winnerId: string; loserId: string }
  | { t: "tableHit"; playerId: string }
  | { t: "speakDone"; playerId: string }
  | { t: "sip"; playerId: string }
  | { t: "immune"; playerId: string }
  | { t: "vote"; playerId: string; value: VoteValue }
  | { t: "chooseNext"; playerId: string; index: 0 | 1 }
  | { t: "troll"; playerId: string; label: string }
  | { t: "nextRound" }
  | { t: "endGame"; playerId?: string }
  | { t: "newGame" };

export class Rejected extends Error {}

/** Toast copy chốt trong thiết kế. Khai báo dạng function để TS thu hẹp kiểu sau khi gọi. */
function reject(msg: string): never {
  throw new Rejected(msg);
}

const findPlayer = (room: Room, id: string): Player | undefined =>
  room.players.find((p) => p.id === id);

const seedOf = (room: Room, salt: number) => {
  let h = 0;
  for (let i = 0; i < room.code.length; i++) h = (h * 31 + room.code.charCodeAt(i)) | 0;
  return Math.abs(h + salt * 977);
};

const addGlasses = (p: Player, sips: number) => {
  p.totalGlasses = Math.round((p.totalGlasses + sips * GLASSES_PER_SIP) * 100) / 100;
};

const addPercent = (p: Player, dose: Dose) => {
  p.totalGlasses = Math.round((p.totalGlasses + dose / 100) * 100) / 100;
};

/** Chỉ tính người đang kết nối — người rớt mạng không chặn vòng. */
const voters = (room: Room, exceptId: string | null) =>
  room.players.filter((p) => p.connected && p.id !== exceptId);

// ── Khởi tạo vòng ───────────────────────────────────────────────────────────

function beginRound(room: Room, index: number, carriedQuestion?: string): void {
  const mode = room.mode ?? "que";
  let type = roundTypeFor(mode, index);
  if (room.rageGauge >= 100) {
    type = "rage";
    room.rageGauge = 0;
  } else if (mode === "que" && index % 4 === 0) {
    type = "wildcard";
  }

  const tier = tierFor(index);
  const seed = seedOf(room, index);

  // Tìm cặp Thiên địch tương khắc (nếu có)
  const activePlayers = room.players.filter((p) => p.connected && p.zodiac);
  let clashPair: [string, string] | null = null;
  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = i + 1; j < activePlayers.length; j++) {
      if (isClash(activePlayers[i].zodiac, activePlayers[j].zodiac)) {
        clashPair = [activePlayers[i].id, activePlayers[j].id];
        break;
      }
    }
    if (clashPair) break;
  }

  const round: Round = {
    index,
    type,
    tier,
    spotlightPlayerId: null,
    question: null,
    verdicts: [],
    votes: [],
    outcome: null,
    nextQuestionOptions: null,
    pushedTo: {},
    clashPair,
    startedAt: Date.now(),
  };

  // Mode 1 (Số trời đã định) — luôn sinh quẻ cho tất cả người chơi
  if (mode === "que") {
    round.verdicts = room.players.map((p) =>
      makeVerdict({
        playerId: p.id,
        name: p.name,
        zodiac: p.zodiac,
        lifePath: p.lifePathNumber,
        round: index,
        rage: type === "rage",
      }),
    );
    if (type === "wildcard") {
      round.question = "QUẺ MẬT CẢ BÀN: Ai có tháng sinh lẻ hoặc đang đeo phụ kiện ➔ Cạn ly 50%!";
    } else if (type === "table") {
      round.question = pickTablePrompt(room.bannedTopics, room.usedQuestions, seed);
      room.usedQuestions.push(round.question);
    }
  } else {
    // Mode 2 (Truth or Drink)
    const ids = room.players.filter((p) => p.connected).map((p) => p.id);
    round.spotlightPlayerId = pickSpotlight(ids, room.current?.spotlightPlayerId ?? null);
    const q =
      carriedQuestion ??
      pickQuestions(tier, room.bannedTopics, room.usedQuestions, 1, seed)[0] ??
      "Bạn từng nói dối để trốn một buổi hẹn chưa?";
    round.question = q;
    room.usedQuestions.push(q);
  }

  room.round = index;
  room.tier = tier;
  room.current = round;
  room.phase = "round";
}

function closeVoting(room: Room): void {
  const r = room.current;
  if (!r || !r.spotlightPlayerId) return;
  const spotlight = findPlayer(room, r.spotlightPlayerId);
  if (!spotlight) return;

  const tin = r.votes.filter((v) => v.value === "tin").length;
  const doi = r.votes.filter((v) => v.value === "doi").length;
  const liar = doi > tin;
  r.outcome = liar ? "liar" : "truth";

  // Ngược đời: ai trả lời thật thì uống, ai né thì không.
  // Thầy Phán nổi giận: ×2 án — vẫn đo bằng ngụm, không đổi đơn vị.
  const reversed = r.type === "reverse";
  const mult = r.type === "rage" || r.type === "duel" ? 2 : 1;
  if (liar) addGlasses(spotlight, 2 * mult);
  else if (reversed) addGlasses(spotlight, 1 * mult);

  for (const v of r.votes) {
    const p = findPlayer(room, v.voterId);
    if (!p) continue;
    const correct = liar ? v.value === "doi" : v.value === "tin";
    if (correct) p.detectivePoints += 1;
  }

  // Người vừa khai chọn 1 trong 2 câu để giao cho người kế.
  const opts = pickQuestions(
    tierFor(r.index + 1),
    room.bannedTopics,
    room.usedQuestions,
    2,
    seedOf(room, r.index + 7),
  );
  r.nextQuestionOptions = opts.length === 2 ? [opts[0], opts[1]] : null;
  room.phase = "reveal";
}

// ── Reducer ─────────────────────────────────────────────────────────────────

export function apply(room: Room, a: Action): Room {
  const r = room.current;

  switch (a.t) {
    case "setMode": {
      if (room.phase !== "lobby") reject("Trận đang chạy");
      room.mode = a.mode;
      break;
    }

    case "setSafety": {
      room.bannedTopics = a.bannedTopics.slice(0, 8);
      break;
    }

    case "startGame": {
      if (!room.mode) reject("Chọn chế độ đi");
      if (room.players.length === 0) reject("Chưa có ai vào");
      if (room.mode === "tod" && room.phase === "lobby") {
        // Vùng cấm là bắt buộc trước Truth or Drink.
        room.phase = "safety";
        break;
      }
      if (room.mode === "que" && room.players.some((p) => !p.birthDate)) {
        reject("Còn người chưa nhập ngày sinh");
      }
      beginRound(room, 1);
      break;
    }

    case "join": {
      if (room.players.length >= 12) reject("Phòng đầy");
      const existing = findPlayer(room, a.playerId);
      if (existing) {
        existing.name = a.name;
        existing.avatarUrl = a.avatarUrl ?? existing.avatarUrl;
        existing.connected = true;
        break;
      }
      if (room.phase === "final") reject("Trận đã kết thúc");
      room.players.push({
        id: a.playerId,
        name: a.name.slice(0, 24),
        avatarUrl: a.avatarUrl ?? null,
        birthDate: null,
        zodiac: null,
        lifePathNumber: null,
        appealUsed: false,
        pushUsed: false,
        immunityUsed: false,
        totalGlasses: 0,
        detectivePoints: 0,
        connected: true,
        joinedAt: Date.now(),
      });
      break;
    }

    case "presence": {
      const p = findPlayer(room, a.playerId);
      if (p) p.connected = a.connected;
      break;
    }

    case "setBirthDate": {
      const p = findPlayer(room, a.playerId);
      if (!p) reject("Không thấy người chơi");
      if (!isValidBirthDate(a.birthDate)) reject("Ngày sinh không hợp lệ");
      p!.birthDate = a.birthDate;
      p!.zodiac = zodiacOf(a.birthDate);
      p!.lifePathNumber = lifePathOf(a.birthDate);
      break;
    }

    // ── Chế độ 1 — Số trời đã định ────────────────────────────────────────
    case "drink": {
      if (!r) reject("Chưa vào vòng");
      const v = r!.verdicts.find((x) => x.playerId === a.playerId);
      if (!v) reject("Vòng này bạn không có quẻ");
      if (v!.drunk) break;
      v!.drunk = true;
      const p = findPlayer(room, a.playerId);
      if (p) addPercent(p, v!.dose);
      if (r!.verdicts.length > 0 && r!.verdicts.every((x) => x.drunk)) {
        room.phase = "reveal";
      }
      break;
    }

    case "appeal": {
      const p = findPlayer(room, a.playerId);
      const v = r?.verdicts.find((x) => x.playerId === a.playerId);
      if (!p || !v) reject("Không có gì để xin");
      if (v!.drunk) reject("Uống rồi còn cãi");
      if (p!.appealUsed) reject("Thầy tha một lần thôi");
      p!.appealUsed = true;
      v!.dose = 25;
      v!.label = DOSE_LABEL(25);
      v!.line = "Thầy nể mặt lần này.";
      room.rageGauge = Math.min(100, (room.rageGauge || 0) + 25);
      break;
    }

    case "push": {
      const p = findPlayer(room, a.playerId);
      const target = findPlayer(room, a.targetId);
      const v = r?.verdicts.find((x) => x.playerId === a.playerId);
      if (!p || !v) reject("Không có án để đẩy");
      if (p.pushUsed) reject("Hết lượt đẩy");
      if (v.drunk) reject("Uống rồi, đẩy gì nữa");
      if (!target || target.id === p!.id) reject("Chọn người khác");
      p!.pushUsed = true;
      v!.drunk = true; // án chuyển đi, mình sạch
      room.rageGauge = Math.min(100, (room.rageGauge || 0) + 25);
      const tv = r!.verdicts.find((x) => x.playerId === target!.id);
      if (tv) {
        // Chuyển toàn bộ án sang người được chọn — cộng dồn, trần vẫn là 100%.
        tv.dose = mergeDose(tv.dose, v!.dose);
        tv.label = DOSE_LABEL(tv.dose);
        tv.line = `${p!.name} đẩy án qua. Nhận đi.`;
        tv.drunk = false;
      } else {
        r!.verdicts.push({
          playerId: target!.id,
          dose: v!.dose,
          label: DOSE_LABEL(v!.dose),
          line: `${p!.name} đẩy án qua. Nhận đi.`,
          drunk: false,
        });
      }
      r!.pushedTo[p!.id] = target!.id;
      break;
    }

    case "duel": {
      const v = r?.verdicts.find((x) => x.playerId === a.playerId);
      if (!v) reject("Không có án để thách");
      if (v!.drunk) reject("Uống rồi");
      v!.dose = 100;
      v!.label = DOSE_LABEL(100);
      v!.line = "Gan to thì trả giá.";
      break;
    }

    case "flipLuck": {
      const v = r?.verdicts.find((x) => x.playerId === a.playerId);
      if (!v) reject("Không có quẻ để lật");
      if (v!.drunk) reject("Uống rồi");
      if (v!.flippedLuck) reject("Đã lật kèo rồi");
      v!.flippedLuck = true;
      const roll = Math.random();
      if (roll < 0.5) {
        v!.dose = 25;
        v!.label = DOSE_LABEL(25);
        v!.line = "Lật kèo THÀNH CÔNG! Giảm nhấp môi 25%.";
      } else {
        v!.dose = 100;
        v!.label = DOSE_LABEL(100);
        v!.line = "Lật kèo THẤT BẠI! Thầy phạt CẠN LY 100%.";
        room.rageGauge = Math.min(100, (room.rageGauge || 0) + 25);
      }
      break;
    }

    case "clashResult": {
      const vWin = r?.verdicts.find((x) => x.playerId === a.winnerId);
      const vLose = r?.verdicts.find((x) => x.playerId === a.loserId);
      if (vWin) {
        vWin.dose = 25;
        vWin.label = DOSE_LABEL(25);
        vWin.line = "THẮNG TƯƠNG KHẮC! Thoát cạn ly.";
      }
      if (vLose) {
        vLose.dose = 100;
        vLose.label = DOSE_LABEL(100);
        vLose.line = "THUA TƯƠNG KHẮC! Nhận trọn CẠN LY 100%.";
      }
      break;
    }

    case "tableHit": {
      if (!r || r.type !== "table" || room.mode !== "que") reject("Không phải vòng cả bàn");
      if (r!.verdicts.some((x) => x.playerId === a.playerId)) break;
      r!.verdicts.push({
        playerId: a.playerId,
        dose: 50,
        label: DOSE_LABEL(50),
        line: "Dính rồi. Nửa ly.",
        drunk: false,
      });
      break;
    }

    // ── Chế độ 2 — Truth or Drink ─────────────────────────────────────────
    case "speakDone": {
      if (!r || r.spotlightPlayerId !== a.playerId) reject("Chưa tới lượt bạn");
      if (voters(room, a.playerId).length === 0) {
        // Chơi một mình thì không có ai soi — coi như thật.
        r!.outcome = "truth";
        room.phase = "reveal";
      }
      break;
    }

    case "sip": {
      if (!r || r.spotlightPlayerId !== a.playerId) reject("Chưa tới lượt bạn");
      const p = findPlayer(room, a.playerId);
      r!.outcome = "skipped";
      // Ngược đời: né thì không uống.
      if (p && r!.type !== "reverse")
        addGlasses(p, r!.type === "rage" || r!.type === "duel" ? 2 : 1);
      room.phase = "reveal";
      break;
    }

    case "immune": {
      if (!r || r.spotlightPlayerId !== a.playerId) reject("Chưa tới lượt bạn");
      const p = findPlayer(room, a.playerId);
      if (!p) reject("Không thấy người chơi");
      if (p!.immunityUsed) reject("Dùng rồi — uống hoặc khai");
      p!.immunityUsed = true;
      r!.outcome = "immune";
      room.phase = "reveal";
      break;
    }

    case "vote": {
      if (!r || !r.spotlightPlayerId) reject("Chưa có ai lên thớt");
      if (r!.spotlightPlayerId === a.playerId) reject("Bạn đang khai, soi ai");
      if (r!.outcome) reject("Chốt phiếu rồi");
      const existing = r!.votes.find((v) => v.voterId === a.playerId);
      if (existing) existing.value = a.value;
      else r!.votes.push({ voterId: a.playerId, value: a.value });
      if (r!.votes.length >= voters(room, r!.spotlightPlayerId).length) {
        closeVoting(room);
      }
      break;
    }

    case "chooseNext": {
      if (!r?.nextQuestionOptions) reject("Chưa tới lúc chọn câu");
      if (r!.spotlightPlayerId !== a.playerId) reject("Không phải lượt bạn");
      const q = r!.nextQuestionOptions[a.index];
      r!.nextQuestionOptions = [q, q];
      break;
    }

    // ── Chung ─────────────────────────────────────────────────────────────
    case "troll": {
      room.trolls.push({
        id: `${Date.now()}-${a.playerId}`,
        playerId: a.playerId,
        label: a.label.slice(0, 12),
        at: Date.now(),
      });
      room.trolls = room.trolls.slice(-24);
      break;
    }

    case "nextRound": {
      if (!room.mode) reject("Chưa chọn chế độ");
      const carried =
        r?.nextQuestionOptions && r.nextQuestionOptions[0] === r.nextQuestionOptions[1]
          ? r.nextQuestionOptions[0]
          : undefined;
      beginRound(room, room.round + 1, carried);
      break;
    }

    case "endGame": {
      room.phase = "final";
      break;
    }

    case "newGame": {
      room.phase = "lobby";
      room.mode = null;
      room.round = 0;
      room.tier = "warm";
      room.current = null;
      room.trolls = [];
      room.usedQuestions = [];
      room.bannedTopics = DEFAULT_BANNED.slice();
      for (const p of room.players) {
        p.appealUsed = false;
        p.pushUsed = false;
        p.immunityUsed = false;
        p.totalGlasses = 0;
        p.detectivePoints = 0;
      }
      break;
    }
  }

  room.updatedAt = Date.now();
  return room;
}

export { ROUNDS_PER_GAME };
