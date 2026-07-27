/**
 * 금액 입력 UX 공통 모듈 (클라이언트 전용).
 *
 * 왜: 계산기 금액 칸이 `type="number"`라 "15000000"처럼 콤마 없이 8자리를 세어가며 넣어야 했다.
 * 자릿수를 잘못 세면 결과가 10배·100배 틀어지는데 사용자가 알아채기 어렵다.
 *
 * 해결: 입력하는 동안 천단위 콤마를 자동으로 넣고, 칸 아래에 "1,500만원"처럼 한글 단위로
 * 환산해 실시간으로 보여준다. 단위는 그대로 '원'을 유지한다(만원 단위 입력은 100배 오입력 위험).
 *
 * 사용법: 금액 input에 `data-money` 속성을 주고(타입은 text + inputmode="numeric"),
 * 페이지 스크립트에서 initMoneyInputs()를 호출한 뒤 값은 moneyValue(id)/moneyRaw(id)로 읽는다.
 */

const digitsOnly = (s) => String(s ?? '').replace(/[^\d]/g, '');

export const formatMoney = (digits) =>
  digits ? Number(digits).toLocaleString('ko-KR') : '';

/** 12345678 → "1,234만 5,678원" (억/만 단위로 끊어 읽기) */
export function koreanAmount(n) {
  if (!Number.isFinite(n) || n <= 0) return '';
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const rest = n % 10_000;
  const parts = [];
  if (eok) parts.push(`${eok.toLocaleString('ko-KR')}억`);
  if (man) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (rest) parts.push(`${rest.toLocaleString('ko-KR')}`);
  return parts.join(' ') + '원';
}

/** 콤마를 제거한 숫자값. 비어 있으면 NaN */
export function moneyValue(id) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  const d = digitsOnly(el?.value);
  return d === '' ? NaN : Number(d);
}

/** 원본 입력 문자열(숫자만). 미입력 판정용 */
export function moneyRaw(id) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  return digitsOnly(el?.value);
}

function hintFor(input) {
  let hint = input.nextElementSibling;
  if (!hint || !hint.classList.contains('money-hint')) {
    hint = document.createElement('p');
    hint.className = 'money-hint';
    hint.setAttribute('aria-live', 'polite');
    input.insertAdjacentElement('afterend', hint);
  }
  return hint;
}

function sync(input) {
  const hint = hintFor(input);
  const n = Number(digitsOnly(input.value));
  hint.textContent = digitsOnly(input.value) ? `= ${koreanAmount(n)}` : '';
}

/** data-money 가 붙은 금액 입력에 콤마 포맷 + 한글 환산 힌트를 붙인다 */
export function initMoneyInputs(root = document) {
  root.querySelectorAll('input[data-money]').forEach((input) => {
    input.setAttribute('type', 'text');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('autocomplete', 'off');

    input.addEventListener('input', () => {
      const before = input.value;
      const caret = input.selectionStart ?? before.length;
      // 캐럿 앞의 '숫자 개수'를 기준으로 위치를 복원해야 콤마가 늘어나도 커서가 튀지 않는다
      const digitsBeforeCaret = digitsOnly(before.slice(0, caret)).length;

      const formatted = formatMoney(digitsOnly(before));
      if (formatted !== before) {
        input.value = formatted;
        let pos = 0;
        let seen = 0;
        while (pos < formatted.length && seen < digitsBeforeCaret) {
          if (/\d/.test(formatted[pos])) seen += 1;
          pos += 1;
        }
        input.setSelectionRange(pos, pos);
      }
      sync(input);
    });

    // 초기값(브라우저 자동완성·뒤로가기 복원)도 정리
    if (input.value) {
      input.value = formatMoney(digitsOnly(input.value));
      sync(input);
    }
  });
}
