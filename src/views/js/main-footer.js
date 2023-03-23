function productUpload() {
  axios
    .get('https://5gnunfleamarket.shop/productss/up')
    .then((res) => {
      window.location.href = '/productss/up';
    })
    .catch((error) => {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
    });
}
