  
function logout() {
    axios
        .post('http://localhost:3000/admin/logout'
        )
        .then((res) => {
            // 응답처리
            alert(res.data)
            window.location.href = '/admin/login'
        })
        .catch((error) => {
            // 예외처리
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
        });
}



function checkLogin(service) {

    if(service === "product") {
        axios
            .get('http://localhost:3000/admin/products')
            .then((res) => {
              window.location.href = '/admin/products'
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                console.log(error)
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
              }
    else if (service === 'user'){
      axios
            .get('http://localhost:3000/users')
            .then((res) => {
              window.location.replace('http://localhost:3000/users')
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                console.log(error)
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
    }
    else if(service === "category"){
      axios
            .get('http://localhost:3000/category')
            .then((res) => {
              window.location.href = '/category'
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                console.log(error)
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
    }
    else if(service === "notice"){
      axios
            .get('http://localhost:3000/notice')
            .then((res) => {
              window.location.href = '/notice'
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
    }
    else if(service === "reports"){
      axios
            .get('http://localhost:3000/reports')
            .then((res) => {
              window.location.href = '/reports'
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
    }
              }



              function handleKeyPress(e) {
  if (e.keyCode === 13) {
    // 엔터 키를 누르면 검색 함수 호출
    search();
  }
}


// Date 객체를 사용하여 일정 기간 전인지 계산하는 함수
function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);
  const years = Math.floor(diff / 31536000000);

  switch (true) {
    case minutes < 5:
      return `방금 전`;
    case hours < 1:
      return `${minutes}분 전`;
    case days < 1:
      return `${hours}시간 전`;
    case weeks < 1:
      return `${days}일 전`;
    case months < 1:
      return `${weeks}주 전`;
    case years < 1:
      return `${months}달 전`;
    default:
      return `${years}년 전`;
  }
}