/** 재검증한 현재 안내만 주요 탐색·광고 대상으로 사용한다. */
export const CORE_GUIDES = ['labor-tax-credit-guide', 'labor-tax-credit-property', 'labor-tax-credit-examples', 'child-tax-credit', 'child-tax-credit-examples', 'labor-tax-credit-late-apply', 'labor-tax-credit-payment-date'];
export const isCurrentGuide = (slug) => CORE_GUIDES.includes(slug);
export const SOURCES = {
  eligibility: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2452&cntntsId=7783',
  application: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40397&cntntsId=238977',
  announcement: 'https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?bbsId=1028&mi=2201&nttSn=1350768',
  child: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2451&cntntsId=7781',
  formula: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1029637937',
};
