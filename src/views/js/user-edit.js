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
      .put('user/api/me/edit', {
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
