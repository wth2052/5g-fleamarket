function getEditUserInformation() {
  //TODO: Restful API
  axios
    .get('/api/user/me/edit')
    .then((res) => {
      let data = res.data.data;
      let addressdata = data.address.split(' ');
      for (let i = 0; i < addressdata.length; i++) {
        if (addressdata.length < 10) {
          addressdata.push('');
        }
      }
      let temp1 = `<div class="container-fluid"  style="width: 100%;margin-top: 10px; padding: 0">
        <form onsubmit="return false;">
            <div class="form-group">
                <label for="id" class="form-label mt-4" style="font-size: 20px;">아이디</label>
                <h2>
                    ${data.email}
                </h2>
            </div>
            <div class="form-group">
                <label class="form-label mt-4" for="nickname" style="font-size: 20px;"><b>닉네임</b></label>
                <input type="text" class="form-control" id="nickname" maxLength="13" aria-describedby="phonenumber" value="${
                  data.nickname
                }">
                <div class="form-group">
                <label class="form-label mt-4" for="phoneNumber" style="font-size: 20px;"><b>휴대폰 번호</b></label>
                 <input type="tel" class="form-control" id="phoneNumber" onInput="autoHypen(this)" maxLength="13" aria-describedby="phonenumber" value="${
                   data.phone
                 }">
                </div>
                <div class="form-group">
                    <label class="form-label mt-4" style="font-size: 20px;"><b>주소</b></label>
                    <div class="form-group">
                <span class="ps_box">
                  <input
                          type="text"
                          class="form-control"
                          id="postcode"
                          placeholder="우편번호"
                          value="${addressdata[7]}"
                  />
                  <input
                          type="button"
                          class="btn"
                          style="background: #79D0F2; color: #FFFFFF; font-weight: bold"
                          onclick="execDaumPostcode()"
                          value="우편번호 찾기"
                  /><br />
                  <input
                          type="text"
                          class="form-control"
                          id="address"
                          placeholder="주소"
                           value="${
                             addressdata[0] +
                             ' ' +
                             addressdata[1] +
                             ' ' +
                             addressdata[2] +
                             ' ' +
                             addressdata[3]
                           }"
                  /><br/>
                  <input
                          type="text"
                          class="form-control"
                          id="detailAddress"
                          placeholder="상세주소"
                          value="${addressdata[5]}"
                  />
                             <input
                          type="text"
                          class="form-control"
                          id="extraAddress"
                          placeholder="참고항목"
                          value="${addressdata[6]}"
                  />
                  </div>
                </span>
                    </div>
                </div>
            </div>
        </form>
</div>
</div>
<button class="btn" style="background: #79D0F2; color: #FFFFFF; font-weight: bold" onclick="editGoogleUserInformation()">회원정보 수정하기</button>
`;
      if (data.address.split === undefined) {
        data.address = '';
      }
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