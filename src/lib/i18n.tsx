"use client";

import React, { createContext, useContext, useState } from "react";

export type Language = "vi" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.vi, params?: Record<string, string | number>) => string;
}

export const translations = {
  vi: {
    // App Header / Common
    appName: "BỢM SONY",
    appSub: "Drinking Game Siêu Cấp",
    langName: "Tiếng Việt",
    tagline: "Vòng xoay ma quái & Truth or Drink",
    
    // Join Form
    joinTitle: "THAM GIA BÀN NHẬU",
    joinSub: "Nhập mã phòng từ Host để bắt đầu",
    roomCode: "MÃ PHÒNG",
    playerName: "TÊN / NICKNAME",
    namePlaceholder: "Ví dụ: Nam Bợm",
    joinBtn: "VÀO PHÒNG",
    createRoom: "TẠO PHÒNG (HOST)",
    invalidCode: "Mã phòng 4 ký tự",
    emptyName: "Nhập tên người chơi",
    
    // Birthdate / Zodiac
    birthdateTitle: "NHẬP NGÀY SINH",
    birthdateSub: "Thầy Phán cần ngày sinh để bấm quẻ tử vi & thần số học",
    birthdateLabel: "NGÀY SINH (YYYY-MM-DD)",
    birthdateBtn: "XÁC NHẬN NGÀY SINH",
    invalidDate: "Ngày sinh không hợp lệ (năm 1920 trở lại)",
    zodiacLabel: "Cung Hoàng Đạo",
    lifePathLabel: "Số Chủ Đạo",
    
    // Mode Select (Host)
    modeTitle: "CHỌN CHẾ ĐỘ CHƠI",
    modeQueTitle: "SỐ TRỜI ĐÃ ĐỊNH",
    modeQueDesc: "Tử vi & Thần số học. Thầy Phán phán ngụm cho từng người. Không khai thì uống!",
    modeTodTitle: "TRUTH OR DRINK",
    modeTodDesc: "Hỏi xoáy đáp bựa. Khai thật hoặc uống. Cả bàn bình chọn Tin / Dối!",
    startBtn: "BẮT ĐẦU TRẬN",
    
    // Lobby
    lobbyTitle: "PHÒNG CHỜ BÀN NHẬU",
    scanQr: "Quét QR hoặc truy cập",
    roomCodeIs: "MÃ PHÒNG:",
    playersJoined: "BỢM ĐÃ VÀO PHÒNG",
    waitingHost: "Chờ Host bắt đầu trận đấu...",
    waitingPlayers: "Chờ người chơi vào phòng...",
    needMinPlayers: "Cần ít nhất 1 người chơi để bắt đầu!",
    waitingBirthdates: "Vẫn còn người chưa nhập ngày sinh!",
    
    // Safety Topics
    safetyTitle: "VÙNG CẤM AN TOÀN",
    safetySub: "Cả bàn gạch những chủ đề KHÔNG Muốn Nhắc Tới tối nay",
    safetyInstruction: "Chạm vào chủ đề để BẬT / TẮT cấm. Các câu hỏi dính chủ đề này sẽ bị loại bỏ.",
    confirmSafety: "XÁC NHẬN VÙNG CẤM & CHƠI",
    
    // Round / Stage
    round: "VÒNG",
    warmup: "KHỞI ĐỘNG",
    midtier: "TẦM TRUNG",
    spicytier: "CAY",
    rageRound: "THẦY PHÁN NỔI GIẬN (x2 ÁN)",
    wildcardRound: "QUẺ MẬT CẢ BÀN",
    tableRound: "CẢ BÀN DÍNH",
    
    // Actions & Buttons (Mobile)
    drinkDone: "ĐÃ UỐNG ĐỦ %",
    appealBtn: "XIN THẦY THA (25%)",
    pushBtn: "ĐẨY ÁN SANG NGƯỜI KHÁC",
    flipLuckBtn: "LẬT KÈO (TRÁO QUẺ)",
    duelBtn: "THÁCH ĐẤU 100%",
    speakBtn: "TÔI ĐÃ KHAI THẬT!",
    sipBtn: "BỎ CÂU này (UỐNG)",
    immuneBtn: "KHIÊN MIỄN TỪ (1 LẦN)",
    voteTin: "TIN (THẬT)",
    voteDoi: "DỐI (XẠO)",
    voted: "ĐÃ CHỌN PHIẾU",
    chooseNextTitle: "CHỌN CÂU HỎI GIAO CHO NGƯỜI KẾ",
    chooseOptA: "LỰA CHỌN A",
    chooseOptB: "LỰA CHỌN B",
    trollTitle: "NÚT TROLL BÀN NHẬU",
    
    // Statuses & Verdicts
    verdictTitle: "LỜI PHÁN CỦA THẦY PHÁN",
    reasonTitle: "LÝ DO PHÁN:",
    taskTitle: "NHIỆM VỤ ĐI KÈM:",
    chainTitle: "DÂY CHUYỀN:",
    drinkingTarget: "BỢM BỊ PHẠT",
    doseFull: "CẠN LY (100%)",
    doseHalf: "NỬA LY (50%)",
    doseSip: "NHẤP MÔI (25%)",
    truthOutcome: "THẬT NGHĨA KÍNH - THOÁT UỐNG",
    liarOutcome: "DỐI TRÁ BỊ BẮT BÀI - PHẠT 2 NGỤM!",
    skippedOutcome: "BỎ CÂU - PHẠT 1 NGỤM",
    immuneOutcome: "DÙNG KHIÊN MIỄN TỪ - AN TOÀN",
    
    // Leaderboard & Podium
    leaderboardTitle: "BẢNG PHONG THẦN",
    bomOfTheNight: "BỢM CỦA ĐÊM",
    detectiveKing: "THÁNH SOI DỐI",
    totalGlasses: "Số ly quy đổi",
    detectivePoints: "Điểm soi đúng",
    endGameBtn: "KẾT THÚC TRẬN ĐẤU",
    newGameBtn: "TRẬN MỚI",
    rank1: "QUÁN QUÂN",
    rank2: "Á QUÂN",
    rank3: "HẠNG 3",
    
    // Notices
    roomGone: "PHÒNG ĐÃ TAN",
    reconnectNotice: "ĐANG NỐI LẠI PHÒNG...",
    spaceToNext: "Nút Space hoặc Enter để qua vòng tiếp theo",
  },
  en: {
    // App Header / Common
    appName: "BỢM SONY",
    appSub: "Ultimate Party Drinking Game",
    langName: "English",
    tagline: "Mystic Astrology & Truth or Drink",
    
    // Join Form
    joinTitle: "JOIN THE DRINKING TABLE",
    joinSub: "Enter room code from Host to get started",
    roomCode: "ROOM CODE",
    playerName: "NAME / NICKNAME",
    namePlaceholder: "E.g. Alex Drinker",
    joinBtn: "JOIN ROOM",
    createRoom: "CREATE ROOM (HOST)",
    invalidCode: "Room code must be 4 characters",
    emptyName: "Please enter your name",
    
    // Birthdate / Zodiac
    birthdateTitle: "ENTER YOUR BIRTHDATE",
    birthdateSub: "The Oracle needs your birthdate for Astrology & Numerology verdict",
    birthdateLabel: "BIRTHDATE (YYYY-MM-DD)",
    birthdateBtn: "CONFIRM BIRTHDATE",
    invalidDate: "Invalid date (year must be 1920 or later)",
    zodiacLabel: "Zodiac Sign",
    lifePathLabel: "Life Path No.",
    
    // Mode Select (Host)
    modeTitle: "SELECT GAME MODE",
    modeQueTitle: "FATE HAS DECIDED",
    modeQueDesc: "Astrology & Numerology. The Oracle dishes doses per player. Drink if you refuse!",
    modeTodTitle: "TRUTH OR DRINK",
    modeTodDesc: "Spicy & funny questions. Spill the truth or drink. The table votes Truth or Liar!",
    startBtn: "START GAME",
    
    // Lobby
    lobbyTitle: "GAME LOBBY",
    scanQr: "Scan QR or visit",
    roomCodeIs: "ROOM CODE:",
    playersJoined: "PLAYERS IN ROOM",
    waitingHost: "Waiting for Host to start...",
    waitingPlayers: "Waiting for players to join...",
    needMinPlayers: "Need at least 1 player to start!",
    waitingBirthdates: "Some players haven't submitted their birthdate yet!",
    
    // Safety Topics
    safetyTitle: "SAFE ZONE TOPICS",
    safetySub: "Tap topics the group wants to BAN from questions tonight",
    safetyInstruction: "Tap topic to BAN / UNBAN. Questions involving banned topics will be excluded.",
    confirmSafety: "CONFIRM SAFE ZONE & PLAY",
    
    // Round / Stage
    round: "ROUND",
    warmup: "WARM UP",
    midtier: "MID TIER",
    spicytier: "SPICY",
    rageRound: "ORACLE'S RAGE (x2 DOSES)",
    wildcardRound: "WILDCARD SECRET QUE",
    tableRound: "ALL TABLE HIT",
    
    // Actions & Buttons (Mobile)
    drinkDone: "DRANK MY % DOSE",
    appealBtn: "APPEAL TO ORACLE (25%)",
    pushBtn: "PUSH PENALTY TO OTHER",
    flipLuckBtn: "FLIP LUCK (SWAP ORACLE)",
    duelBtn: "DUEL CHALLENGE 100%",
    speakBtn: "I TOLD THE TRUTH!",
    sipBtn: "PASS QUESTION (DRINK)",
    immuneBtn: "IMMUNITY SHIELD (ONCE)",
    voteTin: "TRUTH (HONEST)",
    voteDoi: "LIAR (FAKE)",
    voted: "VOTE SUBMITTED",
    chooseNextTitle: "CHOOSE QUESTION FOR NEXT PLAYER",
    chooseOptA: "OPTION A",
    chooseOptB: "OPTION B",
    trollTitle: "TABLE SOUND EFFECTS",
    
    // Statuses & Verdicts
    verdictTitle: "ORACLE'S VERDICT",
    reasonTitle: "ORACLE'S REASON:",
    taskTitle: "BONUS TASK:",
    chainTitle: "CHAIN REACTION:",
    drinkingTarget: "PENALIZED PLAYER",
    doseFull: "BOTTOMS UP (100%)",
    doseHalf: "HALF GLASS (50%)",
    doseSip: "SIP DOSE (25%)",
    truthOutcome: "HONEST TRUTH - FREE FROM DRINKING",
    liarOutcome: "CAUGHT LYING - PENALTY 2 SIPS!",
    skippedOutcome: "PASSED QUESTION - PENALTY 1 SIP",
    immuneOutcome: "IMMUNITY SHIELD USED - SAFE",
    
    // Leaderboard & Podium
    leaderboardTitle: "HALL OF FAME",
    bomOfTheNight: "DRINKER OF THE NIGHT",
    detectiveKing: "LIE DETECTIVE KING",
    totalGlasses: "Equivalent Glasses",
    detectivePoints: "Detective Points",
    endGameBtn: "END GAME",
    newGameBtn: "NEW GAME",
    rank1: "1ST PLACE",
    rank2: "2ND PLACE",
    rank3: "3RD PLACE",
    
    // Notices
    roomGone: "ROOM CLOSED",
    reconnectNotice: "RECONNECTING TO ROOM...",
    spaceToNext: "Press Space or Enter to proceed to next round",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "vi",
  setLang: () => {},
  t: (key) => translations.vi[key] || String(key),
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bom_sony_lang") as Language;
      if (saved === "vi" || saved === "en") return saved;
    }
    return "vi";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("bom_sony_lang", newLang);
  };

  const t = (key: keyof typeof translations.vi, params?: Record<string, string | number>): string => {
    let text = translations[lang]?.[key] || translations.vi[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
