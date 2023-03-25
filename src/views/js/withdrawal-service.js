function withdrawalService() {
  axios
    .post('https://5gnunfleamarket.shop/auth/delete')
    .then(function (res) {
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      }
      if (
        !confirm(
          '정말 회원탈퇴를 진행하시겠습니까? 탈퇴 후 정보는 되돌릴 수 없습니다.',
        )
      ) {
        alert('탈퇴는 한번 생각해보세요~');
        return;
      } else {
        alert(
          '회원 탈퇴가 정상적으로 완료되었습니다. 이용을 원하시는 분은 재가입 부탁드립니다.',
        );
      }
      window.location.href = '/login';
    })
    .catch(function (error) {
      console.log('에러', error);
    });
}
