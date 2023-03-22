



function report(){
        
    const reported = document.getElementById('email').value;
    const title = document.getElementById('val-title').value;
    const description = document.getElementById('val-description').value;

    
    let emailCheck = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    

    if(emailCheck.test(`${reported}`) === false){
      alert('이메일 형식이 잘못되었습니다.')
    }
    else if (title === '' || description === ''){
      alert('제목과 내용을 모두 적어주세요')
    }
    else{
      axios
        .post('/report',
            {
            reported: reported,
            title: title,
            description: description
            }
        )
        .then((res) => {
            // 응답처리
            alert(JSON.stringify(res.data))
            window.location.replace("/me/report")
        })
        .catch((error) => {
          console.log(error)
          if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/'
                }
            else{alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);}
        });
    }

    
    }