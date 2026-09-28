// 새로 고침하면 이어진다 — 같은 탭 안에서만 (2-7 · 2026-09-28)
//   🙋 「종료 버튼을 누루기 전이라면 새로 도침해도 현재 환면으로 와야 하는 거 아니야?」 → 같은 탭의 새로 고침만 이어지고,
//   탭을 닫았다 열면 처음부터(sessionStorage). 「이어 하기」 버튼은 없다 — 다른 학생이 새 탭에서 켜면 늘 캐릭터 선택부터(09-23 개1이 다시 생기지 않게).
//   이어지는 곳 = 마지막으로 들어선 화면의 처음: 프롤로그 처음 · 지도 장의 출발 자리 · 문 앞 화면(푼 빗장은 그대로 · 풀던 판은 처음부터)
//   · 알현 처음 · 갈무리 첫 장 · [종료]를 누르면 지운다(다음에 켜면 시작 화면)
//   점수는 판을 다 푼 뒤에 적힌 것만 남는다 — 풀던 판을 다시 풀어도 두 번 들어가지 않는다
//   쓴 실마리 수는 다 푼 판의 것만 남긴다 — 근정전 앞마당에서 풀 문제가 어긋나지 않게
import grade from '../../grade.json';
import jamoData from '../data/jamo.json';
import { getScore } from './score.js';

const KEY = `sejong-audience-${grade.grade}`;
const VERSION = 1;

export function loadGame() {
  try {
    const g = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (!g || g.v !== VERSION || !g.character || !g.stage) return null;
    return g;
  } catch { return null; }
}

export function saveGame(game) {
  const done = new Set(jamoData.slice(0, game.solved || 0).map((j) => j.id));
  const used = Object.fromEntries(Object.entries(game.used || {}).filter(([id]) => done.has(id)));
  const g = {
    v: VERSION, stage: game.stage, character: game.character, place: game.place || 0, solved: game.solved || 0,
    used, atGate: !!game.atGate, tutored: !!game.tutored, courtDone: game.courtDone || 0, score: getScore(),
  };
  try { sessionStorage.setItem(KEY, JSON.stringify(g)); } catch { /* 저장이 막힌 브라우저 — 이어지지 않을 뿐 게임은 돈다 */ }
}

export function clearGame() {
  try { sessionStorage.removeItem(KEY); } catch { /* 없음 */ }
}
