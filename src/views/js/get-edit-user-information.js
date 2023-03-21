function getEditUserInformation() {
  //TODO: Restful API
  axios
    .get('/api/user/me/edit')
    .then((res) => {
      let data = res.data.data;
      let addressdata = data.address.split(' ');
      console.log(addressdata);
      for (let i = 0; i < addressdata.length; i++) {
        if (addressdata.length < 10) {
          addressdata.push('');
        }
      }

      console.log('성공', data);
      let section1 = `      
        <!-- row -->
                           
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-group">
                                            <h2>  ${data.email} </h2>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                           <input type="password" id="password" name="Password" class="form-control" placeholder="비밀번호" required>
                                            </div>
                                    </div>
                                    <div class="col-lg-6">
                                    <div class="form-group"> 
                                    <input type="password" id="repeatPassword" name="confirmPassword" class="form-control" placeholder="비밀번호 확인" required>
                                         </div>
                                           
                                    </div>
                                </div>                 
`;
      let section2 = `
                        
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-group">
                                            <input type="text" name="nickname" class="form-control" placeholder="닉네임" value="${
        data.nickname
      }" required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <input
                                                    type="text"
                                                    class="form-control"
                                                    id="postcode"
                                                    placeholder="우편번호"
                                                    value="${addressdata[7]}"
                                                    required
                                            />
                                                                                       <input
                                          type="button"
                                          class="btn"
                                          style="background-color: #0597F2; color: #FFFFFF"
                                          onclick="execDaumPostcode()"
                                          value="우편번호 찾기"
                                  />
                                            <input type="text" name="address" id="address" class="form-control" placeholder="주소"                           value="${
                                                    addressdata[0] +
                                                    ' ' +
                                                    addressdata[1] +
                                                    ' ' +
                                                    addressdata[2] +
                                                    ' ' +
                                                    addressdata[3]
                                                  }" required>

                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                         <input type="text" id="detailAddress"name="detailAddress" class="form-control" value="${addressdata[5]}" placeholder="상세 주소" required>
                                         <input type="text" id="extraAddress" class="form-control" placeholder="참고 항목" value="${addressdata[6]}" required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                      <div class="form-group">

                                        </div>
                                    </div>
                                </div>
                           `

      if (data.address.split === undefined) {
        data.address = '';
      }
      document.getElementById('temphere').innerHTML = section1;
      document.getElementById('temphere2').innerHTML = section2;
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
