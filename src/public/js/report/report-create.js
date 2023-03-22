axios
  .get('http://localhost:3000/me/report')
  .then((res) => {
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 401) {
      alert('로그인 후 사용이 가능합니다.');
      window.location.href = '/';
    }
  });



function report(){
        
    const reported = document.getElementById('val-email').value;
    const title = document.getElementById('val-title').value;
    const description = document.getElementById('val-description').value;
    axios
        .post('http://localhost:3000/report',
            {
            reported: reported,
            title: title,
            description: description
            }
        )
        .then((res) => {
            // 응답처리
            alert(JSON.stringify(res.data))
            window.location.replace("http://localhost:3000/report")
        })
        .catch((error) => {
          if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/'
                }
            else{alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);}
        });
    }