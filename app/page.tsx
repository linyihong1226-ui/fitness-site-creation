"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

type MealField = "breakfast" | "lunch" | "dinner" | "protein";
type PhotoCheck = {
  name: string;
  status: "" | "checking" | "passed" | "failed";
  reason: string;
};

type DayLog = {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  protein: boolean;
  workout: boolean;
  stepsDone: boolean;
  waterDone: boolean;
  sleepDone: boolean;
  weight: string;
  waist: string;
  steps: string;
  water: string;
  sleep: string;
  note: string;
  mealText: string;
  mealCalories: string;
  mealProtein: string;
  workoutText: string;
  workoutMinutes: string;
  workoutIntensity: "低" | "中" | "高";
  photoName: string;
  photoStatus: "" | "checking" | "passed" | "failed";
  photoReason: string;
  mealPhotos: Partial<Record<MealField, PhotoCheck>>;
  exerciseChecks: Record<string, boolean>;
};

type Logs = Record<string, DayLog>;
type Favorite = { id: string; title: string; url: string; category: string; note: string };

const starterFavorites: Favorite[] = [
  { id: "starter-cardio", title: "10分钟暴汗高强度有氧舞", url: "https://www.bilibili.com/video/BV1R3411A7g4/", category: "有氧", note: "周三组合课第3段；当天不再追加其他HIIT。" },
  { id: "starter-abs", title: "10分钟新手友好腹部训练", url: "https://www.bilibili.com/video/BV1kA411q7cH/", category: "训练", note: "周三组合课第2段；腰酸时缩小动作幅度。" },
  { id: "starter-chest", title: "10分钟胸部提升负重训练", url: "https://www.bilibili.com/video/BV1Ey4y1Y7zj/", category: "训练", note: "周三组合课第1段；先从每只1.5–3kg开始。" },
];

const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const shortDays = ["一", "二", "三", "四", "五", "六", "日"];

const dayPlans = [
  {
    image: "/exercises/monday.png",
    title: "精简下肢力量",
    tag: "力量 · 30–35分钟",
    steps: "7,500–9,000步",
    kcal: "1,450–1,550 kcal",
    meals: [
      "燕麦40g＋牛奶250ml＋鸡蛋1个＋水果100–150g",
      "米饭120g＋鸡胸肉120g＋蔬菜300g＋油8g",
      "无糖酸奶200g",
      "虾仁120g＋豆腐100g＋红薯150g＋蔬菜250g",
    ],
    workout: [
      "动态热身或快走 5分钟",
      "高脚杯深蹲 2组 × 10次",
      "罗马尼亚硬拉 2组 × 10次",
      "臀桥或臀推 3组 × 12次",
      "髋外展 2组 × 15次",
      "下肢拉伸 5分钟",
    ],
  },
  {
    image: "/exercises/tuesday.png",
    title: "中低强度有氧＋轻核心",
    tag: "有氧 · 35–45分钟",
    steps: "8,000–9,500步",
    kcal: "1,350–1,450 kcal",
    meals: [
      "全麦面包2片＋鸡蛋2个＋无糖豆浆250ml",
      "杂粮饭100g＋清蒸鱼150g＋蔬菜300g＋油8g",
      "水果1份＋原味坚果10g",
      "瘦牛肉100g＋嫩豆腐150g＋玉米100g＋蔬菜300g",
    ],
    workout: [
      "快走、坡度走、骑车或椭圆机 35–45分钟",
      "保持稍喘、仍能说完整句子的强度",
      "鸟狗式 每侧2组 × 10次",
      "侧平板 每侧2组 × 20–30秒",
    ],
  },
  {
    image: "/exercises/wednesday.png",
    title: "帕梅拉三合一组合课",
    tag: "上肢＋核心＋HIIT · 43–48分钟",
    steps: "8,000–9,500步",
    kcal: "1,450–1,550 kcal",
    meals: [
      "高蛋白酸奶200g＋燕麦35g＋半根香蕉＋鸡蛋1个",
      "米饭120g＋瘦牛肉或鸡肉120g＋蔬菜300g＋油8g",
      "训练前：牛奶250ml＋半根香蕉",
      "鸡腿肉或鱼肉120–150g＋薯类180–200g＋蔬菜300g",
    ],
    workout: [
      "热身 5分钟",
      "10分钟胸部提升负重训练",
      "休息 60–90秒",
      "10分钟新手友好腹部训练",
      "休息 90秒并补水",
      "10分钟暴汗高强度有氧舞",
      "慢走＋拉伸 7–8分钟",
    ],
    videos: [
      ["胸部提升负重训练", "https://www.bilibili.com/video/BV1Ey4y1Y7zj/"],
      ["新手友好腹部训练", "https://www.bilibili.com/video/BV1kA411q7cH/"],
      ["暴汗高强度有氧舞", "https://www.bilibili.com/video/BV1R3411A7g4/"],
    ],
  },
  {
    image: "/exercises/thursday.png",
    title: "恢复日",
    tag: "恢复 · 30–45分钟",
    steps: "7,000–9,000步",
    kcal: "1,350–1,450 kcal",
    meals: [
      "玉米150g＋鸡蛋2个＋无糖豆浆250ml",
      "米饭100g＋鱼虾130–150g＋豆腐100g＋蔬菜300g",
      "水果1份＋无糖酸奶150g",
      "鸡胸肉100g＋菌菇蔬菜汤＋山药或南瓜120–150g",
    ],
    workout: ["轻松散步 30–40分钟", "温和全身拉伸 10–15分钟", "不做力量、跳跃或HIIT"],
  },
  {
    image: "/exercises/friday.png",
    title: "背部、肩部＋少量臀部",
    tag: "力量 · 35–45分钟",
    steps: "7,500–9,000步",
    kcal: "1,450–1,550 kcal",
    meals: [
      "燕麦40g＋牛奶250ml＋鸡蛋1个＋水果100g",
      "杂粮饭120g＋鸡胸肉120g＋蔬菜300g＋油8g",
      "无糖酸奶200g＋坚果10g",
      "三文鱼100g或鳕鱼150g＋土豆180g＋蔬菜300g",
    ],
    workout: [
      "热身 5分钟",
      "高位下拉 3组 × 10–12次",
      "坐姿或哑铃划船 3组 × 10次",
      "哑铃肩推 2组 × 10次",
      "侧平举 2组 × 12–15次",
      "面拉 2组 × 15次",
      "臀推 2组 × 12次",
    ],
  },
  {
    image: "/exercises/saturday.png",
    title: "中低强度有氧＋可控外食",
    tag: "有氧 · 45–55分钟",
    steps: "9,000–10,500步",
    kcal: "1,450–1,550 kcal",
    meals: [
      "全麦面包2片＋鸡蛋2个＋牛奶或豆浆250ml",
      "米饭100–120g＋肉或鱼120–150g＋蔬菜300g",
      "水果1份＋无糖酸奶150g",
      "外食：一拳主食＋一掌半蛋白质＋两拳蔬菜",
    ],
    workout: ["快走、骑车、游泳或椭圆机 45–55分钟", "保持中低强度", "不追加第二次HIIT"],
  },
  {
    image: "/exercises/sunday.png",
    title: "休息与准备日",
    tag: "休息 · 可选散步",
    steps: "6,000–8,500步",
    kcal: "1,350–1,450 kcal",
    meals: [
      "红薯150g＋鸡蛋2个＋牛奶250ml",
      "杂粮饭100g＋鱼肉150g＋蔬菜300g＋油8g",
      "水果1份＋坚果10g",
      "豆腐200g＋鸡胸80g或虾仁100g＋南瓜150g＋蔬菜300g",
    ],
    workout: ["完全休息，或轻松散步20–40分钟", "可做10分钟舒缓拉伸", "提前准备下周食材"],
  },
];

const phaseNotes = [
  { weeks: "第1–2周", title: "适应期", note: "按最低组数完成；周三有氧完成70%–80%即可；平均7,500–8,500步。" },
  { weeks: "第3–4周", title: "稳定期", note: "完整完成三段视频；动作轻松时增加0.5–1kg；平均8,500–9,500步。" },
  { weeks: "第5–6周", title: "强化期", note: "保持动作数量，只小幅加重量；周六有氧最多55分钟；平均9,000–10,000步。" },
  { weeks: "第7周", title: "巩固期", note: "维持训练量；若睡眠或恢复变差，周六有氧减少10–15分钟。" },
  { weeks: "第8周", title: "减量期", note: "周一下肢每个动作少1组；周三有氧可全程低冲击；周六缩短至35–45分钟。" },
];

const targetWeights = [49.7, 49.45, 49.15, 48.8, 48.45, 48.15, 47.8, 47.5];

const emptyLog = (): DayLog => ({
  breakfast: false,
  lunch: false,
  dinner: false,
  protein: false,
  workout: false,
  stepsDone: false,
  waterDone: false,
  sleepDone: false,
  weight: "",
  waist: "",
  steps: "",
  water: "",
  sleep: "",
  note: "",
  mealText: "",
  mealCalories: "",
  mealProtein: "",
  workoutText: "",
  workoutMinutes: "",
  workoutIntensity: "中",
  photoName: "",
  photoStatus: "",
  photoReason: "",
  mealPhotos: {},
  exerciseChecks: {},
});

function keyFor(week: number, day: number) {
  return `w${week + 1}d${day + 1}`;
}

function completion(log?: DayLog) {
  if (!log) return 0;
  const keys: (keyof DayLog)[] = ["breakfast", "lunch", "dinner", "protein", "workout", "stepsDone", "waterDone", "sleepDone"];
  return Math.round((keys.filter((key) => log[key]).length / keys.length) * 100);
}

function mondayOfCurrentWeek() {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  return monday.toISOString().slice(0, 10);
}

export default function Home() {
  const [active, setActive] = useState<"today" | "calendar" | "stats" | "library" | "plan">("today");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [startDate, setStartDate] = useState(mondayOfCurrentWeek());
  const [logs, setLogs] = useState<Logs>({});
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteDraft, setFavoriteDraft] = useState({ title: "", url: "", category: "训练", note: "" });
  const [editingMeals, setEditingMeals] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [mealPhotoPreviews, setMealPhotoPreviews] = useState<Partial<Record<MealField, string>>>({});
  const [photoType, setPhotoType] = useState("训练");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fit8-logs");
    const savedStart = localStorage.getItem("fit8-start");
    const savedFavorites = localStorage.getItem("fit8-favorites");
    queueMicrotask(() => {
      if (saved) {
        try { setLogs(JSON.parse(saved)); } catch { /* ignore malformed local data */ }
      }
      if (savedStart) setStartDate(savedStart);
      if (savedFavorites) {
        try { setFavorites(JSON.parse(savedFavorites)); } catch { setFavorites(starterFavorites); }
      } else setFavorites(starterFavorites);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("fit8-logs", JSON.stringify(logs));
    localStorage.setItem("fit8-start", startDate);
    localStorage.setItem("fit8-favorites", JSON.stringify(favorites));
  }, [logs, startDate, favorites, ready]);

  const selectedKey = keyFor(selectedWeek, selectedDay);
  const log = { ...emptyLog(), ...(logs[selectedKey] || {}) };
  const selectedPlan = dayPlans[selectedDay];

  const dayDate = useMemo(() => {
    const date = new Date(`${startDate}T12:00:00`);
    date.setDate(date.getDate() + selectedWeek * 7 + selectedDay);
    return date;
  }, [startDate, selectedWeek, selectedDay]);

  const update = <K extends keyof DayLog>(field: K, value: DayLog[K]) => {
    setLogs((current) => ({
      ...current,
      [selectedKey]: { ...(current[selectedKey] || emptyLog()), [field]: value },
    }));
  };

  const weekRates = useMemo(() => Array.from({ length: 8 }, (_, week) => {
    const rates = Array.from({ length: 7 }, (_, day) => completion(logs[keyFor(week, day)]));
    return Math.round(rates.reduce((a, b) => a + b, 0) / 7);
  }), [logs]);

  const weights = useMemo(() => Object.entries(logs)
    .filter(([, value]) => value.weight && !Number.isNaN(Number(value.weight)))
    .map(([key, value]) => ({ key, value: Number(value.weight) })), [logs]);

  const latestWeight = weights.at(-1)?.value;
  const weightChange = latestWeight && weights[0] ? latestWeight - weights[0].value : null;
  const totalRate = Math.round(weekRates.reduce((a, b) => a + b, 0) / 8);

  const mealCalories = Number(log.mealCalories || (selectedPlan.kcal.startsWith("1,450") ? 1500 : 1400));
  const mealProtein = Number(log.mealProtein || 88);
  const calorieRange = selectedPlan.kcal.startsWith("1,450") ? [1400, 1600] : [1300, 1500];
  const mealAssessment = mealCalories >= calorieRange[0] && mealCalories <= calorieRange[1] && mealProtein >= 80 && mealProtein <= 105;
  const workoutMinutes = Number(log.workoutMinutes || (selectedDay === 3 || selectedDay === 6 ? 35 : selectedDay === 2 ? 45 : 40));
  const overloadTerms = selectedDay === 2 && /跳绳|跑步|腿举|分腿蹲|额外HIIT|冲刺/.test(log.workoutText);
  const workoutAssessment = workoutMinutes >= 20 && workoutMinutes <= 65 && !overloadTerms;
  const workoutItems = (log.workoutText.trim() ? log.workoutText : selectedPlan.workout.join("\n"))
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const mealRows: { field: MealField; label: string; text: string }[] = [
    { field: "breakfast", label: "早餐", text: selectedPlan.meals[0] },
    { field: "lunch", label: "午餐", text: selectedPlan.meals[1] },
    { field: "dinner", label: "晚餐", text: selectedPlan.meals[3] },
    { field: "protein", label: "加餐／蛋白质", text: `${selectedPlan.meals[2]} · 今日蛋白质85–90g` },
  ];

  const chooseDay = (week: number, day: number) => {
    setSelectedWeek(week);
    setSelectedDay(day);
    setActive("today");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let stale = false;
    loadPhoto(selectedKey).then((blob) => {
      if (stale) return;
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(blob ? URL.createObjectURL(blob) : "");
    });
    return () => { stale = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  useEffect(() => {
    let stale = false;
    const fields: MealField[] = ["breakfast", "lunch", "dinner", "protein"];
    Promise.all(fields.map(async (field) => [field, await loadPhoto(`${selectedKey}:meal:${field}`)] as const)).then((items) => {
      if (stale) return;
      setMealPhotoPreviews((current) => {
        Object.values(current).forEach((url) => url && URL.revokeObjectURL(url));
        return Object.fromEntries(items.filter(([, blob]) => blob).map(([field, blob]) => [field, URL.createObjectURL(blob!)]));
      });
    });
    return () => { stale = true; };
  }, [selectedKey]);

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    update("photoStatus", "checking");
    update("photoName", file.name);
    const result = await inspectPhoto(file);
    await savePhoto(selectedKey, file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
    update("photoStatus", result.passed ? "passed" : "failed");
    update("photoReason", result.reason);
    if (result.passed) update(photoType === "训练" ? "workout" : photoType === "餐食" ? "protein" : "stepsDone", true);
  };

  const handleMealPhoto = async (field: MealField, file?: File) => {
    if (!file) return;
    const setPhotoCheck = (photo: PhotoCheck, checked?: boolean) => {
      setLogs((current) => {
        const currentLog = { ...emptyLog(), ...(current[selectedKey] || {}) };
        return {
          ...current,
          [selectedKey]: {
            ...currentLog,
            ...(checked === undefined ? {} : { [field]: checked }),
            mealPhotos: { ...currentLog.mealPhotos, [field]: photo },
          },
        };
      });
    };
    setPhotoCheck({ name: file.name, status: "checking", reason: "正在检查图片……" });
    const result = await inspectPhoto(file);
    await savePhoto(`${selectedKey}:meal:${field}`, file);
    setMealPhotoPreviews((current) => {
      if (current[field]) URL.revokeObjectURL(current[field]!);
      return { ...current, [field]: URL.createObjectURL(file) };
    });
    setPhotoCheck({ name: file.name, status: result.passed ? "passed" : "failed", reason: result.reason }, result.passed ? true : undefined);
  };

  const toggleExercise = (index: number, checked: boolean) => {
    setLogs((current) => {
      const currentLog = { ...emptyLog(), ...(current[selectedKey] || {}) };
      const exerciseChecks = { ...currentLog.exerciseChecks, [String(index)]: checked };
      const workout = workoutItems.every((_, itemIndex) => exerciseChecks[String(itemIndex)]);
      return { ...current, [selectedKey]: { ...currentLog, exerciseChecks, workout } };
    });
  };

  const toggleWholeWorkout = (checked: boolean) => {
    const exerciseChecks = Object.fromEntries(workoutItems.map((_, index) => [String(index), checked]));
    setLogs((current) => ({
      ...current,
      [selectedKey]: { ...emptyLog(), ...(current[selectedKey] || {}), exerciseChecks, workout: checked },
    }));
  };

  const addFavorite = () => {
    const url = favoriteDraft.url.trim();
    const title = favoriteDraft.title.trim();
    if (!title || !/^https?:\/\//i.test(url)) return;
    setFavorites((items) => [{ id: crypto.randomUUID(), ...favoriteDraft, title, url }, ...items]);
    setFavoriteDraft({ title: "", url: "", category: "训练", note: "" });
  };

  return (
    <main className="site-shell">
      <header className="hero">
        <div className="eyebrow">8 WEEK BODY RECOMP</div>
        <div className="hero-row">
          <div>
            <h1>轻盈，不匆忙。</h1>
            <p>从49.9kg出发，用8周认真吃饭、规律训练，也温柔地照顾恢复。</p>
          </div>
          <div className="goal-card">
            <span>阶段目标</span>
            <strong>47–47.8<small> kg</small></strong>
            <em>最终体脂目标 27%</em>
          </div>
        </div>
        <div className="hero-meta">
          <label>
            计划开始日
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <div><b>{totalRate}%</b><span>总完成率</span></div>
          <div><b>{weights.length}</b><span>次晨重记录</span></div>
        </div>
      </header>

      <nav className="tabs" aria-label="页面导航">
        {([['today', '今日打卡'], ['calendar', '8周日历'], ['stats', '进度统计'], ['library', '收藏库'], ['plan', '完整计划']] as const).map(([id, label]) => (
          <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}</button>
        ))}
      </nav>

      {active === "today" && (
        <section className="content today-layout">
          <div className="main-column">
            <div className="day-picker">
              <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))} aria-label="选择周数">
                {Array.from({ length: 8 }, (_, i) => <option value={i} key={i}>第 {i + 1} 周</option>)}
              </select>
              <div className="day-buttons">
                {shortDays.map((day, i) => <button key={day} className={selectedDay === i ? "active" : ""} onClick={() => setSelectedDay(i)}>{day}</button>)}
              </div>
            </div>

            <div className="today-heading">
              <div>
                <span>{dayDate.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}</span>
                <h2>{selectedPlan.title}</h2>
              </div>
              <div className="score-ring" style={{ "--score": `${completion(log)}%` } as React.CSSProperties}>
                <b>{completion(log)}%</b><small>完成</small>
              </div>
            </div>

            <div className="check-card">
              <div className="section-title"><span>01</span><h3>饮食打卡</h3><em>{selectedPlan.kcal}</em><button className="edit-button" onClick={() => setEditingMeals((v) => !v)}>{editingMeals ? "收起编辑" : "修改餐食"}</button></div>
              {editingMeals && <div className="editor-box">
                <label>修改后的全天餐食<textarea value={log.mealText || selectedPlan.meals.join("\n")} onChange={(e) => update("mealText", e.target.value)} /></label>
                <div className="editor-numbers">
                  <label>预计热量<input inputMode="numeric" value={log.mealCalories} placeholder={selectedPlan.kcal.startsWith("1,450") ? "1500" : "1400"} onChange={(e) => update("mealCalories", e.target.value)} /><small>kcal</small></label>
                  <label>预计蛋白质<input inputMode="numeric" value={log.mealProtein} placeholder="88" onChange={(e) => update("mealProtein", e.target.value)} /><small>g</small></label>
                </div>
                <Assessment passed={mealAssessment} passedText="符合减脂计划" failedText={`建议调整至${calorieRange[0]}–${calorieRange[1]} kcal、蛋白质80–105g`} />
              </div>}
              <div className="meal-list">
                {mealRows.map(({ field, label, text }) => {
                  const photo = log.mealPhotos[field];
                  const preview = mealPhotoPreviews[field];
                  return <div className={`meal-row ${log[field] ? "checked" : ""}`} key={field}>
                    <label className="meal-check">
                      <input type="checkbox" checked={log[field]} onChange={(e) => update(field, e.target.checked)} />
                      <span className="custom-check">✓</span>
                      <span><b>{label}</b>{text}</span>
                    </label>
                    <label className={`meal-photo-upload ${preview ? "has-photo" : ""}`}>
                      <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(e) => handleMealPhoto(field, e.target.files?.[0])} />
                      {preview ? <img src={preview} alt={`${label}打卡照片`} /> : <span aria-hidden="true">＋</span>}
                      <b>{preview ? "更换照片" : "拍照打卡"}</b>
                    </label>
                    {photo?.status && <small className={`meal-photo-status ${photo.status}`}>
                      {photo.status === "checking" ? "正在检查……" : photo.status === "passed" ? "✓ 照片打卡成功" : `请重拍：${photo.reason}`}
                    </small>}
                  </div>;
                })}
              </div>
            </div>

            <div className="check-card workout-card">
              <div className="section-title"><span>02</span><h3>训练打卡</h3><em>{selectedPlan.tag}</em><button className="edit-button" onClick={() => setEditingWorkout((v) => !v)}>{editingWorkout ? "收起编辑" : "修改训练"}</button></div>
              {editingWorkout && <div className="editor-box">
                <label>修改后的训练内容<textarea value={log.workoutText || selectedPlan.workout.join("\n")} onChange={(e) => update("workoutText", e.target.value)} /></label>
                <div className="editor-numbers">
                  <label>总时长<input inputMode="numeric" value={log.workoutMinutes} placeholder={selectedDay === 2 ? "45" : "40"} onChange={(e) => update("workoutMinutes", e.target.value)} /><small>分钟</small></label>
                  <label>训练强度<select value={log.workoutIntensity} onChange={(e) => update("workoutIntensity", e.target.value as DayLog["workoutIntensity"])}><option>低</option><option>中</option><option>高</option></select></label>
                </div>
                <Assessment passed={workoutAssessment} passedText="训练负荷合适" failedText={overloadTerms ? "周三不建议追加跑步、跳绳或额外高强度训练" : "建议把单次训练控制在20–65分钟"} />
              </div>}
              <div className="movement-list">
                {workoutItems.map((item, index) => {
                  const checked = Boolean(log.exerciseChecks[String(index)]);
                  return <div className={`movement-row ${checked ? "checked" : ""}`} key={`${item}-${index}`}>
                    <label className="movement-check">
                      <input type="checkbox" checked={checked} onChange={(e) => toggleExercise(index, e.target.checked)} />
                      <span className="custom-check">✓</span>
                      <span className="movement-number">{String(index + 1).padStart(2, "0")}</span>
                      <b>{item}</b>
                    </label>
                    <a className="movement-video" href={videoForMovement(item)} target="_blank" rel="noreferrer" aria-label={`观看${item}动作讲解视频`}>
                      <span aria-hidden="true">▶</span> 动作讲解
                    </a>
                  </div>;
                })}
              </div>
              <label className={`workout-done ${log.workout ? "checked" : ""}`}>
                <input type="checkbox" checked={log.workout} onChange={(e) => toggleWholeWorkout(e.target.checked)} />
                <span className="custom-check">✓</span>
                <b>{log.workout ? "今天的训练已全部完成" : "一键完成全部训练"}</b>
              </label>
            </div>

            <div className="check-card photo-card">
              <div className="section-title"><span>04</span><h3>照片打卡</h3><em>自动基础质量检查</em></div>
              <div className="photo-layout">
                <label className={`photo-drop ${photoPreview ? "has-photo" : ""}`}>
                  <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(e) => handlePhoto(e.target.files?.[0])} />
                  {photoPreview ? <img src={photoPreview} alt="今日打卡照片预览" /> : <><b>＋ 上传今日照片</b><span>支持 JPG、PNG、WebP</span></>}
                </label>
                <div className="photo-controls">
                  <label>照片类型<select value={photoType} onChange={(e) => setPhotoType(e.target.value)}><option>训练</option><option>餐食</option><option>步数</option></select></label>
                  {log.photoStatus === "checking" && <p className="photo-status checking">正在检查图片……</p>}
                  {log.photoStatus === "passed" && <p className="photo-status passed">✓ 自动打卡成功<br/><small>{log.photoReason}</small></p>}
                  {log.photoStatus === "failed" && <p className="photo-status failed">需要重新上传<br/><small>{log.photoReason}</small></p>}
                  <p className="photo-help">系统只检查图片格式、尺寸和曝光是否适合打卡，不会根据照片诊断体脂或替代营养师判断。</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="side-column">
            <div className="metrics-card">
              <div className="section-title"><span>03</span><h3>生活记录</h3></div>
              <div className="metric-grid">
                <Metric label="步数" unit="步" value={log.steps} placeholder="8500" onChange={(v) => update("steps", v)} />
                <Metric label="饮水" unit="L" value={log.water} placeholder="2.0" onChange={(v) => update("water", v)} />
                <Metric label="睡眠" unit="h" value={log.sleep} placeholder="8.0" onChange={(v) => update("sleep", v)} />
                <Metric label="晨重" unit="kg" value={log.weight} placeholder="49.7" onChange={(v) => update("weight", v)} />
                <Metric label="腰围" unit="cm" value={log.waist} placeholder="选填" onChange={(v) => update("waist", v)} />
              </div>
              <div className="micro-checks">
                <SmallCheck label="步数达标" checked={log.stepsDone} onChange={(v) => update("stepsDone", v)} />
                <SmallCheck label="饮水达标" checked={log.waterDone} onChange={(v) => update("waterDone", v)} />
                <SmallCheck label="睡眠达标" checked={log.sleepDone} onChange={(v) => update("sleepDone", v)} />
              </div>
              <label className="note-field">今天的感受<textarea value={log.note} onChange={(e) => update("note", e.target.value)} placeholder="能量、食欲、经期、训练感受……" /></label>
            </div>
            <div className="reminder-card">
              <span>今日提醒</span>
              <p>{selectedDay === 2 ? "三段视频已经是完整训练，今天不追加跑步、跳绳或其他HIIT。" : selectedDay === 0 ? "下肢只做计划内动作，每组保留2–3次余力。" : "稳定完成比一次做到筋疲力尽更重要。"}</p>
              <b>{selectedPlan.steps}</b>
            </div>
          </aside>
        </section>
      )}

      {active === "calendar" && (
        <section className="content calendar-view">
          <div className="page-intro"><span>56 DAYS</span><h2>八周，一天一天来</h2><p>点击任意日期进入打卡；颜色越深，代表当天完成度越高。</p></div>
          <div className="calendar-grid">
            {Array.from({ length: 8 }, (_, week) => (
              <div className="week-row" key={week}>
                <div className="week-label"><b>W{week + 1}</b><span>{weekRates[week]}%</span></div>
                {Array.from({ length: 7 }, (_, day) => {
                  const rate = completion(logs[keyFor(week, day)]);
                  return <button key={day} onClick={() => chooseDay(week, day)} style={{ "--fill": `${rate}%` } as React.CSSProperties}><span>{dayNames[day]}</span><b>{rate || "·"}{rate ? "%" : ""}</b><small>{dayPlans[day].title}</small></button>;
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {active === "stats" && (
        <section className="content stats-view">
          <div className="page-intro"><span>PROGRESS</span><h2>看趋势，不审判单日数字</h2><p>第一周的水分波动很常见，用7日平均和腰围一起判断。</p></div>
          <div className="stat-cards">
            <div><span>当前记录</span><b>{latestWeight ? `${latestWeight.toFixed(1)} kg` : "尚未记录"}</b><small>目标区间 47–47.8 kg</small></div>
            <div><span>累计变化</span><b>{weightChange === null ? "—" : `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} kg`}</b><small>以第一次晨重为基准</small></div>
            <div><span>计划完成率</span><b>{totalRate}%</b><small>饮食、训练与生活习惯</small></div>
          </div>
          <div className="progress-panel">
            <h3>每周进度</h3>
            {weekRates.map((rate, week) => <div className="progress-row" key={week}><span>第{week + 1}周</span><div><i style={{ width: `${rate}%` }} /></div><b>{rate}%</b><small>参考体重 {targetWeights[week]}kg</small></div>)}
          </div>
          <div className="weight-log">
            <h3>晨重记录</h3>
            {weights.length ? <div className="weight-chips">{weights.slice(-14).map((item) => <span key={item.key}><small>{item.key.toUpperCase()}</small><b>{item.value.toFixed(1)}</b></span>)}</div> : <p>还没有记录。回到“今日打卡”填写晨重后，这里会自动汇总。</p>}
          </div>
        </section>
      )}

      {active === "library" && (
        <section className="content library-view">
          <div className="page-intro"><span>SAVED FOR LATER</span><h2>把喜欢的训练，收进自己的库</h2><p>粘贴视频链接、写下训练部位和备注，下次编排计划时不再翻遍收藏夹。</p></div>
          <div className="library-layout">
            <div className="favorite-form">
              <h3>收藏一个新内容</h3>
              <label>名称<input value={favoriteDraft.title} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, title: e.target.value })} placeholder="例如：15分钟弹力带上肢" /></label>
              <label>视频或文章链接<input value={favoriteDraft.url} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, url: e.target.value })} placeholder="https://..." /></label>
              <label>分类<select value={favoriteDraft.category} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, category: e.target.value })}><option>训练</option><option>拉伸</option><option>有氧</option><option>饮食</option><option>知识</option></select></label>
              <label>备注<textarea value={favoriteDraft.note} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, note: e.target.value })} placeholder="适合哪一天、需要什么器械、训练感受……" /></label>
              <button onClick={addFavorite} disabled={!favoriteDraft.title.trim() || !/^https?:\/\//i.test(favoriteDraft.url.trim())}>加入收藏库</button>
            </div>
            <div className="favorite-list">
              {favorites.length ? favorites.map((item) => <article key={item.id}>
                <span>{item.category}</span><h3>{item.title}</h3><p>{item.note || "暂时没有备注"}</p>
                <div><a href={item.url} target="_blank" rel="noreferrer">打开链接 ↗</a><button onClick={() => setFavorites((items) => items.filter((x) => x.id !== item.id))}>移除</button></div>
              </article>) : <div className="empty-library"><b>收藏库还是空的</b><p>先把你常练的B站视频放进来吧。</p></div>}
            </div>
          </div>
        </section>
      )}

      {active === "plan" && (
        <section className="content plan-view">
          <div className="page-intro"><span>THE PLAN</span><h2>完整计划，一眼看清</h2><p>饮食按7天循环，训练随周数逐步调整，不需要每天临时决定。</p></div>
          <div className="phase-grid">{phaseNotes.map((phase) => <div key={phase.weeks}><span>{phase.weeks}</span><h3>{phase.title}</h3><p>{phase.note}</p></div>)}</div>
          <div className="weekly-plan">
            {dayPlans.map((plan, day) => <article key={plan.title}>
              <div className="plan-day"><img src={plan.image} alt={`${plan.title}动作图示`} /><span>{dayNames[day]}</span><b>{plan.title}</b><small>{plan.tag}</small></div>
              <div><h4>当天饮食</h4><ol>{plan.meals.map((meal) => <li key={meal}>{meal}</li>)}</ol></div>
              <div><h4>当天训练</h4><ol>{plan.workout.map((item) => <li key={item}>{item}<a className="plan-video-link" href={videoForMovement(item)} target="_blank" rel="noreferrer">讲解视频 ↗</a></li>)}</ol></div>
            </article>)}
          </div>
          <div className="rules-card"><h3>调整规则</h3><ul><li>每周平均下降0.15–0.35kg：保持计划。</li><li>连续2周体重均值和腰围都不变：每天增加约1,500步。</li><li>增加步数后再过2周仍不变：每天减少约100 kcal，但不低于1,300 kcal。</li><li>每周下降超过0.5kg或力量明显下降：每天增加100–150 kcal。</li><li>经期前后暂不调整，等经期结束后再看趋势。</li></ul></div>
        </section>
      )}

      <footer><span>8周身体重塑计划</span><p>记录只保存在当前浏览器中。关节刺痛、胸闷、眩晕或月经异常时，请暂停并寻求专业建议。</p></footer>
    </main>
  );
}

function Metric({ label, unit, value, placeholder, onChange }: { label: string; unit: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="metric"><span>{label}</span><div><input inputMode="decimal" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /><small>{unit}</small></div></label>;
}

function SmallCheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className={checked ? "checked" : ""}><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span>✓</span>{label}</label>;
}

function Assessment({ passed, passedText, failedText }: { passed: boolean; passedText: string; failedText: string }) {
  return <div className={`assessment ${passed ? "passed" : "failed"}`}><b>{passed ? "✓" : "!"}</b><span>{passed ? passedText : failedText}</span></div>;
}

function videoForMovement(item: string) {
  if (item.includes("胸部提升负重训练")) return "https://www.bilibili.com/video/BV1Ey4y1Y7zj/";
  if (item.includes("新手友好腹部训练")) return "https://www.bilibili.com/video/BV1kA411q7cH/";
  if (item.includes("暴汗高强度有氧舞")) return "https://www.bilibili.com/video/BV1R3411A7g4/";
  const topic = item
    .replace(/\d+\s*(分钟|秒|组|次)/g, "")
    .replace(/[×＋、，或·]/g, " ")
    .trim();
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(`${topic} 正确动作讲解`)}`;
}

function mediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fit8-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("photos");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePhoto(key: string, file: File) {
  const db = await mediaDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("photos", "readwrite");
    tx.objectStore("photos").put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function loadPhoto(key: string): Promise<Blob | null> {
  if (typeof indexedDB === "undefined") return null;
  const db = await mediaDb();
  const result = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction("photos", "readonly");
    const request = tx.objectStore("photos").get(key);
    request.onsuccess = () => resolve((request.result as Blob) || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return result;
}

async function inspectPhoto(file: File): Promise<{ passed: boolean; reason: string }> {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) return { passed: false, reason: "请使用JPG、PNG或WebP图片。" };
  if (file.size > 12 * 1024 * 1024) return { passed: false, reason: "图片超过12MB，请压缩后重试。" };
  const bitmap = await createImageBitmap(file);
  if (bitmap.width < 480 || bitmap.height < 480) {
    bitmap.close();
    return { passed: false, reason: "图片尺寸偏小，建议至少480×480像素。" };
  }
  const canvas = document.createElement("canvas");
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { passed: true, reason: "图片格式和尺寸有效。" };
  ctx.drawImage(bitmap, 0, 0, 64, 64);
  bitmap.close();
  const data = ctx.getImageData(0, 0, 64, 64).data;
  let brightness = 0;
  for (let i = 0; i < data.length; i += 4) brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
  brightness /= data.length / 4;
  if (brightness < 25) return { passed: false, reason: "画面过暗，建议在光线更好的地方重新拍摄。" };
  if (brightness > 242) return { passed: false, reason: "画面曝光过亮，主体可能不清楚。" };
  return { passed: true, reason: "图片格式、尺寸和曝光通过基础检查，已自动勾选对应打卡项。" };
}
