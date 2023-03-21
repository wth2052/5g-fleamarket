
    function report(){
        
    const reported = document.getElementById('reported').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
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
                    window.location.href = '/admin/login'
                }
            else{alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);}
        });
    }

