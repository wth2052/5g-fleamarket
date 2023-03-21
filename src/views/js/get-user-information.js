//TODO: Restful API
axios
  .get('http://localhost:3000/api/user/me')
  .then((res) => {
    const data = res.data.data;
    console.log('성공', data);
    let temp1 = `<div class="container-fluid"  style="width: 100%;background: #fff; margin-top: 20px; padding: 0">
        <div class="container">
            <div class="row">`;
    let temp2 = `<i class="fa-solid fa-user-secret" style="font-size: 100px"></i><br><div class="col">${data.nickname} 님,<br> 냐옹상회에 오신것을 환영합니다!</div>`;
    let temp3 = `
                <div class="col-6 col-md-4" onclick="location.href='/me/edit'" style="font-size: 20px" >🛠정보 수정</div>
            </div>
            <div class="col">
                한칸 공백
            </div>
            <div class="container"></div>
            <div class="col" onclick="location.href='/report'" style="font-size: 20px" >🚨 불량 유저 신고하기</div>
            <div class="col" onclick="logout()" style="font-size: 20px" >💡 로그아웃</div>
            <div class="col">
                한칸 공백
            </div>
            <div class="col">
                
            </div>
            
            <div class="col" id="withdrawal" onclick="withdrawalService()" style="color: red; font-size: 25px">🎭회원 탈퇴 * 주의 되돌릴수 없음 *</div>
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
function logout(){
  axios
    .post('http://localhost:3000/auth/logout',
    )
    .then((res) => {
      // 응답처리
      alert("정상적으로 로그아웃 처리 되었습니다.")
      window.location.href = "/login"

    })
    .catch((error) => {
      // 예외처리
      alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
    });
}
