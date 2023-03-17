function withdrawalService() {
  axios
    .post('http://localhost:3000/auth/delete')
    .then(function (res) {
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      }
      alert(
        '회원 탈퇴가 정상적으로 완료되었습니다. 이용을 원하시는 분은 재가입 부탁드립니다.',
      );
      window.location.href = '/';
    })
    .catch(function (error) {
      console.log('에러', error);
    });
}
