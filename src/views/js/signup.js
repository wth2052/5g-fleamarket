let regEmail =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/; // 이메일 주소 길이까지 확실한 검증
let regNickname = /^[가-힣]+$/; // 한글만
// 우편번호 찾기 화면을 넣을 element
let isverifyed = false;
//   메일 전송
function sendMail(event) {
  const email = document.getElementById('email').value;
  // 검증에 사용할 정규식
  if (email.match(regEmail) != null) {
  } else {
    alert('올바른 형식의 이메일이 아닙니다.');
    return;
  }
  axios.post('http://localhost:3000/email-verify', { email: email });
  alert('메일이 성공적으로 전송되었습니다. 인증번호의 유효기간은 10분입니다.');
}
function startTimer() {
  let time = 600; //기준시간 작성
  let min = ''; //분
  let sec = ''; //초
  let currentTimer = null;
  //setInterval(함수, 시간) : 초마다 실행
  let x = setInterval(function () {
    //parseInt() : 정수를 반환
    min = parseInt(time / 60); //몫을 계산
    sec = time % 60; //나머지를 계산
    document.getElementById('mailTimer').innerHTML = min + '분' + sec + '초';
    time--;
    document
      .getElementById('emailButton')
      .addEventListener('click', function () {
        clearInterval(x);
        startTimer();
      });
    //타임아웃 시
    if (time < 0) {
      clearInterval(x); //setInterval() 실행을 끝냄
      document.getElementById('mailTimer').innerHTML =
        '시간이 초과되었습니다. 다시 인증을 진행해주세요.';
    }
    if (isverifyed === true) {
      clearInterval(x);
    }
  }, 1000);

}

function signUp() {
  let userid = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let rptpassword = document.getElementById('repeatPassword').value;
  let usernickname = document.getElementById('nickname').value;
  let phonenumber = document.getElementById('phoneNumber').value; // 휴대폰번호
  let address1 = document.getElementById('address').value; // 경기 00시 00로
  let address2 = document.getElementById('extraAddress').value; // (00동 00아파트)
  let address3 = document.getElementById('detailAddress').value; // 000동 000호
  let address4 = document.getElementById('postcode').value; // 우편번호
  let newAddress = address1 + ' ' + address2 + ' ' + address3 + ' ' + address4;
  // const newPhoneNumber = phonenumber.replaceAll('-', '');

  if (userid.value === '') {
    //해당 입력값이 없을 경우
    alert('아이디를 입력해주세요.');
    userid.focus();
    return false;
  }
  if (password.value === '') {
    alert('비밀번호를 입력해주세요.');
    password.focus();
    return false;
  }
  // 영+숫+특 포함 8자 이상
  const pwdCheck =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!pwdCheck.test(password)) {
    alert(
      '비밀번호는 한개의 영문, 한개의 숫자, 한개의 특수문자를 포함한 8자 이상이 되어야 합니다.',
    );
    setTimeout(function () {
      document.getElementById('password').focus();
    }, 100);
    return false;
  }

  if (rptpassword !== password) {
    alert('비밀번호가 일치하지 않습니다.');
    rptpassword.focus();
    return false;
  }
  if (usernickname.value === '') {
    alert('이름을 입력하세요.');
    usernickname.focus();
    return false;
  }
  // let reg = /^\d{3}-\d{3,4}-\d{4}$/;
  // if (!reg.test(newPhoneNumber.value)) {
  //   alert("전화번호는 숫자만 입력할 수 있습니다.");
  //   newPhoneNumber.focus();
  //   return false;
  // }
  if (userid.value === '') {
    alert('이메일 주소를 입력하세요.');
    userid.focus();
    return false;
  }
  if (isverifyed === false) {
    alert('이메일 인증을 진행해주세요.');
    return;
  }
  axios
    .post('http://localhost:3000/auth/signup', {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      email: userid.toString(),
      nickname: usernickname.toString(),
      password: password.toString(),
      phone: phonenumber.toString(),
      address: newAddress.toString(),
    })
    .then((result) => {
      alert('회원가입이 완료되었습니다.');
      window.location.href = '/login';
    })
    .catch((error) => {
      if (error.response.status === 400)
        alert('이미 존재하는 이메일입니다. 다른 이메일 아이디를 입력해주세요.');
      if (error.response.status === 401) alert(error);
    });
}
function emailNumberVerify() {
  const verifyNumber = document.getElementById('verifyNumber').value;
  const email = document.getElementById('email').value;
  if (verifyNumber === '') {
    //해당 입력값이 없을 경우
    alert('인증번호를 입력해주세요.');
    verifyNumber.focus();
    return;
  }
  axios
    .post('http://localhost:3000/email-verify/verify-number', {
      verifyNumber: parseInt(verifyNumber),
      email,
    })
    .then((result) => {
      alert('이메일 인증에 성공하였습니다.');
      isverifyed = true;
      return isverifyed;
    })
    .catch((error) => {
      alert('인증번호가 올바르지 않거나, 서버 에러입니다.' + error);
      return isverifyed;
    });
}