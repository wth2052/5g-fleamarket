//TODO: 전에 썼던 비밀번호와 일치할 경우 비밀번호 변경 불가능하게 만들기
//현재 : 비밀번호 변경 가능
//정규식을 모아서 가져다 쓸수 있게 만들기
function editGoogleUserInformation() {
  let usernickname = document.getElementById('nickname').value;
  let phonenumber = document.getElementById('phoneNumber').value; // 휴대폰번호
  let address1 = document.getElementById('address').value; // 경기 00시 00로
  let address2 = document.getElementById('extraAddress').value; // (00동 00아파트)
  let address3 = document.getElementById('detailAddress').value; // 000동 000호
  let address4 = document.getElementById('postcode').value; // 우편번호
  let newAddress = address1 + ' ' + address2 + ' ' + address3 + ' ' + address4;

  axios
    .put('https://5gnunfleamarket.shop/api/user/google/edit', {
      nickname: usernickname.toString(),

      phone: phonenumber.toString(),
      address: newAddress.toString(),
    })
    .then(function (res) {
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      }
      alert('회원정보가 성공적으로 수정되었습니다.');
      window.location.reload();
    })

    .catch(function (error) {
      console.log('에러', error);
    });
}
