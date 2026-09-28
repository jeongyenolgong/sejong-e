// 《세종대왕을 알현하라!》 — 게임의 차례
//
//   불러오기 → ① 시작 → ② 캐릭터 선택 → ③ 프롤로그 → ④ 지도 ↔ ⑤ 문 앞(자모 조합 · 힌트 퀴즈 · 점검 퀴즈 · 왼쪽 위 점수)
//   → ⑥ 알현 → ⑦ 갈무리 판 11장 → ⑧ 서약서 → ⑨ 잠든 모습
//
// 화면의 정의는 기획 문서(요소정의_v1.md · 화면텍스트_목록_v1.md)가 SSOT다. 코드 주석의 절 번호가 그 문서의 절이다.
import './styles/base.css';
import './styles/screens.css';
import './styles/journey.css';
import './styles/board.css';
import './styles/ending.css';

import { t } from './lib/text.js';
import { preloadAll, config, imageUrl } from './lib/assets.js';
import { drawFavicon } from './lib/favicon.js';
import { mountScore, setScore } from './lib/score.js';
import { loadGame, saveGame } from './lib/save.js';
import { startScreen } from './screens/start.js';
import { selectScreen } from './screens/select.js';
import { prologue } from './screens/prologue.js';
import { journey } from './screens/journey.js';
import { audience } from './screens/audience.js';
import { ending } from './screens/ending.js';

// 오래 누르면 뜨는 메뉴(그림 저장 · 안드로이드)와 오른쪽 클릭 메뉴를 막는다 (2-3)
document.addEventListener('contextmenu', (e) => e.preventDefault());

async function main() {
  document.title = t('T-01');                 // 탭 제목 = T-01 (두 학년 같게)
  drawFavicon(t('I-01'));                      // 탭 아이콘 = 붉은 도장 안에 「한」

  // 불러오는 동안 — 글 없이 시작 화면 바탕색만. 글꼴과 시작 화면 그림이 준비되면 시작 화면이 떠오른다
  await Promise.all([document.fonts.load('400 1em "Gowun Batang"'), document.fonts.load('700 1em "Gowun Batang"'),
    preloadAll(['bg_start', 'ch_front_f', 'ch_front_m'])]);

  // 알림창 · 판 · 갈무리 · 서약서에 까는 본선 한지(EL-02)
  const paper = await config('el_hanji_main');
  // CSS 변수 안의 상대 경로는 CSS 파일 자리를 기준으로 풀리므로, 페이지 기준의 온전한 주소로 넘긴다
  const paperUrl = new URL(imageUrl(paper.file), document.baseURI).href;
  document.documentElement.style.setProperty('--paper-main', `url("${paperUrl}")`);

  mountScore(document.getElementById('game'));   // 점수 칸 — 지도에 들어설 때 보인다 (2-6)

  // 같은 탭에서 새로 고침하면 마지막으로 들어선 화면의 처음에서 이어진다 · 새 탭이면 늘 시작 → 캐릭터 선택부터 (2-7 · lib/save.js)
  //   「이어서 하기」 버튼은 없다 (2026-09-23 🙋 「이어하기 버튼이 없으면 기능도 없어야 해.」 — 탭을 넘어 이어지지 않는다)
  let game = loadGame();
  const stages = ['prologue', 'journey', 'audience', 'ending'];
  const from = (s) => !game || stages.indexOf(game.stage) <= stages.indexOf(s);
  if (game) setScore(game.score || 0);
  else {
    await startScreen();
    const character = await selectScreen();
    game = { character, solved: 0, place: 0, stage: 'prologue' };   // 지도 1장째(육조거리)에서 시작
    saveGame(game);
  }
  if (game.stage === 'prologue') await prologue(game.character);

  if (from('journey')) {
    game.stage = 'journey'; saveGame(game);
    await journey(game);                        // 지도와 문 — 빗장 11개
  }
  let hall;
  if (from('audience')) {
    game.stage = 'audience'; saveGame(game);
    hall = await audience(game);                // 알현
  } else {
    hall = await audience(game, { settled: true });   // 갈무리에서 새로 고침 — 알현 그림만 깔고 곧바로
  }
  game.stage = 'ending'; saveGame(game);
  await ending(game, hall);                     // 갈무리 → 서약서 → 잠든 모습 (알현 그림을 어둡게 깐 채로) · [종료]에서 저장을 지운다
}

main();
