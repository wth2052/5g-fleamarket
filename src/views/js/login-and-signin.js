const loginBtn = document.getElementById('login');

function login() {
  const email = document.getElementById('id').value;
  const password = document.getElementById('password').value;
  axios
    .post('/api/auth/login', { email: email, password: password })
    .then((res) => {
      // 응답처리
      alert('로그인에 성공하였습니다.');
      window.location.replace('/');
    })
    .catch((error) => {
      // 예외처리
      //TODO: 500 서버에러시 에러 처리
      // console.log(error );
      if (error.response.status === 401) {
        alert('블랙리스트 유저입니다. 로그인이 허용되지 않습니다.');
      } else {
        alert('아이디나 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
      }
    });
}
function signup() {
  window.location.replace('/');
}
