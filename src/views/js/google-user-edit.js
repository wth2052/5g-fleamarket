//TODO: 전에 썼던 비밀번호와 일치할 경우 비밀번호 변경 불가능하게 만들기
//현재 : 비밀번호 변경 가능
//정규식을 모아서 가져다 쓸수 있게 만들기
function editUserInformation() {
  let password = document.getElementById('password').value;
  let rptpassword = document.getElementById('repeatPassword').value;
  let usernickname = document.getElementById('nickname').value;
  let phonenumber = document.getElementById('phoneNumber').value; // 휴대폰번호
  let address1 = document.getElementById('address').value; // 경기 00시 00로
  let address2 = document.getElementById('extraAddress').value; // (00동 00아파트)
  let address3 = document.getElementById('detailAddress').value; // 000동 000호
  let address4 = document.getElementById('postcode').value; // 우편번호
  let newAddress = address1 + ' ' + address2 + ' ' + address3 + ' ' + address4;
  if (password.value === '') {
    alert('비밀번호를 입력해주세요.');
    password.focus();
    return false;
  }
  if (rptpassword !== password) {
    alert('비밀번호가 일치하지 않습니다.');
    rptpassword.focus();
    return false;
  }
  const pwdCheck =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!pwdCheck.test(password)) {
    alert(
      '비밀번호는 한개의 영문, 한개의 숫자, 한개의 특수문자를 포함한 8자 이상이 되어야 합니다.',
    );

    axios
      .put('/google/edit', {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        nickname: usernickname.toString(),
        password: password.toString(),
        phone: phonenumber.toString(),
        address: newAddress.toString(),
      })
      .then(function (res) {
        if (res.status === 401) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
        }
        console.log('수정성공', data);
        return data;
      })
      .catch(function (error) {
        console.log('에러', error);
      });
  }
}
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
                <h2>${data.email}</h2>
            </div>
            <div class="form-group">
                <div class="valid-feedback"></div>
                <label class="form-label mt-4" for="nickname">닉네임</label>
                <input type="text" class="form-control" id="nickname" value="${data.nickname}">
                <div class="form-group">
                    <label for="tel" class="form-label mt-4">휴대폰 번호</label>
                    <input type="text" class="form-control" id="phoneNumber" oninput="autoHypen(this)" maxlength="13" aria-describedby="phoneNumber" value="${data.phone}">
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
                  /><br />
                  <input
                          type="text"
                          class="form-control"
                          id="detailAddress"
                          placeholder="상세주소"
                  />
                  <input
                          type="text"
                          class="form-control"
                          id="extraAddress"
                          placeholder="참고항목"
                  />
                    <!-- iOS에서는 position:fixed 버그가 있음, 적용하는 사이트에 맞게 position:absolute 등을 이용하여 top,left값 조정 필요 -->

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
