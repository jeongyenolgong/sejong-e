// 점수 (2-6 · 2026-09-28) — 화면 왼쪽 위 칸 「120점」(D-03) · 지도·문 앞 화면에서만 · 판·알림창이 떠도 딤 위에 보인다
//   점검 퀴즈(문항마다): 한 번에 40 · 틀릴 때마다 −10(이 물음의 틀린 보기만 · 같은 보기는 한 번) → 초등 40·30·20 · 중등 40·30·20·10
//   자모 조합(판마다): 실마리 안 씀 40 · 하나마다 −10 · 넷 이상 0 · 만점 두 학년 모두 440 + 440 = 880
//   근정전 남은 실마리 문제 · 힌트 퀴즈 · 자모 잘못 놓기 · 연습 판은 점수와 상관없다 · 끝(알현 뒤 · 서약서 · PDF)에는 보이지 않는다
//   오를 때 — 칸 옆에 「+40」이 떠오르고(0.4 · 알림창이 뜨는 초) 1.2초 머물고(낙관이 머무는 초) 사라진다 · 숫자는 그 순간 바뀐다 · 0점이면 아무것도 없다
//   같은 탭에서 새로 고침하면 판을 다 푼 뒤까지의 점수에서 이어진다(save.js · 2-7) · 새로 켜면 0에서
import { el, wait } from './dom.js';
import { t } from './text.js';
import { T, reduced } from './timing.js';

let total = 0;
const num = el('span.score-num');
const plus = el('span.score-plus', { 'aria-hidden': 'true' });
const box = el('div.score', { hidden: true }, [num, plus]);
const draw = () => { num.textContent = t('D-03').replace('{n}', total); };

// 무대에 한 번 붙인다 — 화면을 갈아 끼워도 남는다(전환 막 아래)
export function mountScore(game) { draw(); game.insertBefore(box, game.firstChild); }
export function showScore(on) { box.hidden = !on; }
export const getScore = () => total;
export function setScore(n) { total = n; draw(); }

export async function addScore(n) {
  if (n <= 0) return;
  total += n;
  draw();
  if (reduced()) return;
  plus.textContent = `+${n}`;
  plus.style.transitionDuration = `${T.noticeFade}ms`;
  plus.classList.remove('on'); void plus.offsetWidth; plus.classList.add('on');
  await wait(T.noticeFade + T.sealHold);
  plus.classList.remove('on');
}
