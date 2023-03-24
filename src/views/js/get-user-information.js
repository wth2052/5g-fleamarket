//TODO: Restful API
axios
  .get('/api/user/me')
  .then((res) => {
    const data = res.data.data;
    console.log('성공', data);
    let temp1 = `<div class="container-fluid"  style="width: 100%;background: #fff; margin-top: 20px; padding: 0">
        <div class="container">
            <div class="row">`;

    let temp2 = `  
<div class="d-flex justify-content-between">
<div></div>
<i  class="fa-solid fa-cat" style="font-size: 150px; border: 2px solid black;" ></i>
<div></div>
</div>
`;
    let temp3 = `
                <div class="d-grid gap-2">
                 <br>
                <div class="alert alert-primary" role="alert" style="font-size: 23px;"><b>${data.nickname}</b> 님,<br> 냐옹상회에 오신것을 환영합니다!<br> 오늘도 좋은하루 되세요.</div>
                <button type="button" class="btn" onclick="location.href='/me/edit'" style="font-size: 20px; color: #FFFFFF; background: #79D0F2";  >⚙️ 정보 수정 ⚙️</button>
            
            <div class="container"></div>
            <button type="button" class="btn" onclick="location.href='/me/report'" style="font-size: 20px; background: #79D0F2; color: #FFFFFF" >🤬 불량 유저 신고하기 🤬</button>
            <div class="col">
               
            </div>
         <button type="button" class="btn btn-danger" id="withdrawal" onclick="withdrawalService()" style=" font-size: 20px">🚨 회원 탈퇴 🚨</button>
        </div>
        </div>
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
    .post('/api/auth/logout',
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
