//TODO: Restful API
axios
  .get('user/api/me')
  .then((res) => {
    const data = res.data.data;
    console.log('성공', data);

    let temp1 = `<div className="container-fluid" style="width: 100%;background: #fff; margin-top: 20px; padding: 0">
        <form>
            <div className="form-group">
                <label htmlFor="id" className="form-label mt-4">아이디</label>
                <h2>
                    ${data.email}
                </h2>
            </div>
            <div className="form-group">
                <label className="form-label mt-4" htmlFor="password">비밀번호</label>
                <input type="password" className="form-control" id="password">
                <div className="valid-feedback"></div>
                <label className="form-label mt-4" htmlFor="rptpassword">비밀번호 재확인</label>
                <input type="password" className="form-control" id="repeatPassword">
                <div className="valid-feedback"></div>
                <label className="form-label mt-4" htmlFor="nickname">닉네임</label>
                <input type="text" className="form-control" id="nickname" value="\`%{data.nickname}\`">
                <div className="form-group">
                    <label htmlFor="tel" className="form-label mt-4">휴대폰 번호</label>
                    <input type="text" className="form-control" id="phoneNumber" onInput="autoHypen(this)" maxLength="13"
                           aria-describedby="phoneNumber" value="\`%{data.phone}\`">
                </div>
                <div className="form-group">
                    <label className="form-label mt-4">주소</label>
                    <div className="form-group">
                <span className="ps_box">
                  <input
                          type="text"
                          className="form-control"
                          id="postcode"
                          placeholder="우편번호"
                          value="\`%{data.address.split(" ")[7]}\`"
                  />
                  <input
                          type="button"
                          onClick="execDaumPostcode()"
                          value="우편번호 찾기"
                  /><br/>
                  <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="주소"
                          value="${data.address.split(" ")[0] + ' ' + data.address.split(" ")[1] + ' ' + data.address.split(" ")[2] + ' ' + data.address.split(" ")[3]}"
                  /><br/>
                  <input
                          type="text"
                          className="form-control"
                          id="detailAddress"
                          placeholder="상세주소"
                          value="\`%{data.address.split(" ")[5]}\`"
                  />
                  <input
                          type="text"
                          className="form-control"
                          id="extraAddress"
                          placeholder="참고항목"
                          value="\`%{data.address.split(" ")[6]}\`"
                  />
                    <!-- iOS에서는 position:fixed 버그가 있음, 적용하는 사이트에 맞게 position:absolute 등을 이용하여 top,left값 조정 필요 -->
\t                <div
                            id="layer"
                            style="
                      display: none;
                      position: fixed;
                      overflow: hidden;
                      z-index: 1;
                      -webkit-overflow-scrolling: touch;
                    "
                    >
                    <img
                            src="//t1.daumcdn.net/postcode/resource/images/close.png"
                            id="btnCloseLayer"
                            style="
                        cursor: pointer;
                        position: absolute;
                        right: -3px;
                        top: -3px;
                        z-index: 1;
                      "
                            onClick="closeDaumPostcode()"
                            alt="닫기 버튼"
                    />
                  </div>
                </span>
                    </div>
                </div>
                <button onClick="editUserInformation()">회원정보 수정하기</button>
            </div>
`;

    document.getElementById('temphere').innerHTML = temp1;
    return data;
  })
  .catch((error) => {
    // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
    console.log(error);
    if (error.response.status === 401 || 500) {
      alert('로그인하셔야 합니다.');
      window.location.href = '/login';
    }
  });
