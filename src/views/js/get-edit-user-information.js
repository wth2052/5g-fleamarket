
function getEditUserInformation() {
  //TODO: Restful API
  axios
    .get('/api/user/me/edit')
    .then((res) => {
      const data = res.data.data;
      console.log('성공', data);

      let temp1 = `<div class="container-fluid"  style="width: 100%;background: #fff; margin-top: 20px; padding: 0">
        <form>
            <div class="form-group">
                <label for="id" class="form-label mt-4" >아이디</label>
                <h2>
                    ${data.email}
                </h2>
            </div>
            <div class="form-group">
                <label class="form-label mt-4" for="password">비밀번호</label>
                <input type="password" class="form-control" id="password">
                <div class="valid-feedback"></div>
                <label class="form-label mt-4" for="rptpassword">비밀번호 재확인</label>
                <input type="password" class="form-control" id="repeatPassword">
                <label class="form-label mt-4" for="nickname">닉네임</label>
                <input type="text" class="form-control" id="nickname" maxLength="13" aria-describedby="phonenumber" value="${
                  data.nickname
                }">
                <div class="form-group">
                <label class="form-label mt-4" for="phoneNumber">휴대폰 번호</label>
                 <input type="tel" class="form-control" id="phoneNumber" onInput="autoHypen(this)" maxLength="13" aria-describedby="phonenumber" value="${
                   data.phone
                 }">
                </div>
                <div class="form-group">
                    <label class="form-label mt-4">주소</label>
                    <div class="form-group">
                <span class="ps_box">
                  <input
                          type="text"
                          class="form-control"
                          id="postcode"
                          placeholder="우편번호"
                          value="${data.address.split(' ')[7]}"
                  />
                  <input
                          type="button"
                          onclick="execDaumPostcode()"
                          value="우편번호 찾기"
                  /><br />
                  <input
                          type="text"
                          class="form-control"
                          id="address"
                          placeholder="주소"
                           value="${
                             data.address.split(' ')[0] +
                             ' ' +
                             data.address.split(' ')[1] +
                             ' ' +
                             data.address.split(' ')[2] +
                             ' ' +
                             data.address.split(' ')[3]
                           }"
                  /><br/>
                  <input
                          type="text"
                          class="form-control"
                          id="detailAddress"
                          placeholder="상세주소"
                          value="${data.address.split(' ')[5]}"
                  />
                  <input
                          type="text"
                          class="form-control"
                          id="extraAddress"
                          placeholder="참고항목"
                          value="${data.address.split(' ')[6]}"
                  />
                    <!-- iOS에서는 position:fixed 버그가 있음, 적용하는 사이트에 맞게 position:absolute 등을 이용하여 top,left값 조정 필요 -->
                  <div
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
                            onclick="closeDaumPostcode()"
                            alt="닫기 버튼"
                    />
                  </div>
                </span>
                    </div>
                </div>
                <button onclick="editUserInformation()">회원정보 수정하기</button>
            </div>
        </form>
</div>
</div>
`;

      document.getElementById('temphere').innerHTML = temp1;
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401 || 500) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/login';
      }
    });
}
//TODO: 전에 썼던 비밀번호와 일치할 경우 비밀번호 변경 불가능하게 만들기
//현재 : 비밀번호 변경 가능
//정규식을 모아서 가져다 쓸수 있게 만들기
