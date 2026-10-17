/** 기본판 완성 모습 — 실제 앱 캡처가 아니라 설명용으로 그린 화면이다. */
export function AppPreview() {
  return (
    <figure className="preview" aria-label="기본판 완성 모습 설명용 화면">
      <div className="pv-ribbon">설명용 화면 · 실제 앱 캡처가 아닙니다 · 항목은 모두 연수용 가상</div>
      <div className="pv-app" aria-hidden="true">
        <div className="pv-top">
          <b>학교 밖 활동공간 탐색기</b>
          <span className="pv-badge">연수용 가상 자료</span>
          <span className="pv-dim">조회 시각 10:30</span>
        </div>
        <div className="pv-body">
          <div className="pv-filter">
            <i>분류</i>
            <span>시설대관 ▾</span>
            <i>지역</i>
            <span>전체 ▾</span>
            <i>접수 상태</i>
            <span>☑ 접수기간 내</span>
            <i>이용 희망 날짜</i>
            <span>📅 선택</span>
          </div>
          <div className="pv-list">
            <div className="pv-tabs">
              <span className="on">목록</span>
              <span>지도</span>
              <span>접수 일정</span>
            </div>
            <p className="pv-scope">현재 읽은 자료 500행 중 검색 · 결과 3건</p>
            <div className="pv-item on">
              <b>연수용 가상 다목적실 A</b>
              <small>접수기간 내 · 원자료: 접수중 · 무료</small>
            </div>
            <div className="pv-item">
              <b>연수용 가상 다목적실 A (2회차)</b>
              <small>접수 전 · 원자료: 접수중</small>
            </div>
            <div className="pv-item">
              <b>연수용 가상 강당 C</b>
              <small className="warn">기간상 접수중 · 원자료: 접수마감 ⚠</small>
            </div>
          </div>
          <div className="pv-detail">
            <b>연수용 가상 다목적실 A</b>
            <div className="pv-period rcpt">
              <i>접수 기간</i>기준일 −1일 ~ +5일
            </div>
            <div className="pv-period use">
              <i>이용 기간</i>기준일 +10일 ~ +20일
            </div>
            <small>대상 원문 · 요금 원문 · 문의 · 원문 링크 없음</small>
            <span className="pv-btn">원문에서 접수 확인</span>
          </div>
        </div>
        <div className="pv-compare">
          비교함 2/4 <span>다목적실 A</span>
          <span>강당 C</span>
          <em>검토표 인쇄</em>
        </div>
      </div>
      <figcaption>
        완성하면 이런 배치가 됩니다. 접수 기간(청록)과 이용 기간(남색)을 다른 색으로 나누고, 계산한 상태 옆에 원자료 상태를 그대로 보여 줍니다. ‘원문에서 접수 확인’은 예약 버튼이 아니라 공식 페이지로 가는 링크입니다.
      </figcaption>
    </figure>
  )
}
