axios
  .get('http://localhost:3000/productss/view')
  .then((res) => {
    let data = res.data;
    console.log(data);
    console.log(data[0].images[0].imagePath);
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        const timeAgo = getTimeAgo(data[i].createdAt);
        temp += `
                    <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${data[i].images[0].imagePath}" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${data[i].title}</h3>
<!--                <span style="float: right;"><button onclick="dealUpdate(${data[i].id})"> 수정하기</button></span>-->
                <h4>${data[i].price}원</h4>
<!--                <span style="float: right;"><button onclick="dealDelete(${data[i].id})"> 취소하기</button></span>-->
                <h6>${timeAgo}</h6>
                <span>조회: ${data[i].viewCount}회</span>
                <br>
                <span style="float: right;">🎯 ${data[i].dealCount} ❤ ${data[i].likes}</span>
            </div>
        </div>
      </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    }
  })
  .catch((error) => {
    console.log(error);
    let temp = '';
    temp += `
                    <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="spcFuck" 
                        style="width: 100%; height: 100%; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>메인페이지</h3>
                <h4>아직 ㅁㄴㅇㄻㄴㅇㄹ 전입니다.</h4>
                <p>asdfasdfasf</p>
                <span>asdfasdfasf</span>
                <span></span>
            </div>
        </div>
      </div>`;
    document.getElementById('bb').innerHTML = temp;
  });
