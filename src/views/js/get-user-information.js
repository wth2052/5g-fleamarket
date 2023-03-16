//TODO: Restful API
axios
  .get('user/api/me')
  .then((res) => {
    const data = res.data.data;
    console.log('성공', data);
    let temp1 = `<div class="container-fluid"  style="width: 100%;background: #fff; margin-top: 20px; padding: 0">
        <div class="container">
            <div class="row">`;
    let temp2 = `[프로필사진] ${data.nickname} 님, 환영합니다!`;
    let temp3 = `
                <div class="col-6 col-md-4" onclick="location.href='/me/edit'">내 정보 관리</div>
            </div>
            <div class="col">
                한칸 공백
            </div>
            <div class="container"></div>
            <div class="col" onclick="location.href='/report'" >🚨 불량 유저 신고하기</div>
            <div class="col" onclick="logout()" >💡 로그아웃</div>
        </div>`;
    document.getElementById('temp1').innerHTML = temp1;
    document.getElementById('temp2').innerHTML = temp2;
    document.getElementById('temp3').innerHTML = temp3;
    return data;
  })

  .catch((error) => {
    // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
    console.log(error);
    if (error.response.status === 401 || 500) {
      alert('로그인하셔야 합니다.');
      window.location.href = '/login';
    }
  });
