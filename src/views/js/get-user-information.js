function getUserInformation() {
  axios
    .get('/user/me')
    .then(function (res) {
      const data = res.data;
      console.log('성공', data);
      return data;
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/';
        return;
      }
      console.log('에러', error);
    });
}