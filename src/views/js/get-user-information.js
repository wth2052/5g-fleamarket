function getUserInformation() {
  axios
    .get('/me')
    .then(function (res) {
      const data = res.data;
      return data;
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/login';
      }
    });
}
