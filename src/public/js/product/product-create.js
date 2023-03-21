axios
  .get('http://localhost:3000/productss/up')
  .then((res)   )





  function like() {
    axios
      .post(`http://localhost:3000/productss/up`)
      .then((response) => {
        window.location.href = 'http://localhost:3000/';
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          alert('로그인 후 이용 가능합니다.');
          window.location.href = '/login';
        }else if (error.response.status === 404) {
          alert( '');
        }
      });
  }