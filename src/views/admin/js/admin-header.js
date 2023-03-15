  
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
            .get('http://localhost:3000/products')
            .then((res) => {
              window.location.href = '/products'
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


function search() {
  const search = document.getElementById('search').value;
  console.log(search);

  if (window.location.href === 'http://localhost:3000/products'){
    axios
    .get(`http://localhost:3000/productSearch?search=${search}`)
    .then((res) => {
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {

        document.getElementById(`bb`).innerHTML = "";

        const timeAgo = getTimeAgo(data[i].createdAt);

        // 검색어 배경색 적용
        const title = data[i].title.replace(
          new RegExp(`(${search})`, 'gi'),
          '<span style="background-color: yellow">$1</span>',
        );
        

        temp += `

        <div class="container-fluid" style=" margin-top: 20px;" onclick="getProduct(${data[i].id})" id="bb">
                <div class="row" style="cursor: pointer; ">
                  <div class="col-md-3" style="margin-left: 13%;" id="image-container">
                    <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="spcFuck" id="image"/>
                  </div>
                  <div class="col-md-8" id="products-column" >
                      <h3 > ${title}</h3>
                      <h3>${data[i].price} 원</h3>
                      <br>
                      <span style="float: right;">❤ ${data[i].likes}</span>
                      <span style="float: right;">🎯${data[i].dealCount}  &nbsp </span>
                      <span style="float: right;">👀:${data[i].viewCount}회 &nbsp</span>
                      
                    </div>
                </div>
              </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
                alert(error.response.data.message);
      window.location.reload();
            }
     
    });
  }
  else if (window.location.href === 'http://localhost:3000/users'){
    axios
    .get(`http://localhost:3000/userSearch?search=${search}`)
    .then((res) => {
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {

        document.getElementById(`bb`).innerHTML = "";

        // 검색어 배경색 적용
        const nickname = data[i].nickname.replace(
          new RegExp(`(${search})`, 'gi'),
          '<span style="background-color: yellow">$1</span>',
        );

        if (data[i].ban === 1) {

           temp += `<div class="container-fluid" style=" margin-top: 20px;" onclick="getUser(${data[i].id})">
                <div class="row">
                  <div class="col-md-8" style="padding: 10px; margin-left: 17%; border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                    
                      <h4>닉네임: </h4>
                      <h3 style="margin-left: 30px;"> ${nickname}</h3>
                      <br>
                      <h4>이메일: </h4>
                      <h3 style="margin-left: 30px;">${data[i].email} </h3 >
                      <br>
                      <h4>전화번호: </h4>
                      <h3 style="margin-left: 7px;">  ${data[i].phone}</h3>
                      <span style="float: right;margin-top:45px"> 😡블랙리스트 </span>
                    </div>
                   
                </div>
              </div>`
        }

        else{
          temp += `<div class="container-fluid" style=" margin-top: 20px;" onclick="getUser(${data[i].id})">
                <div class="row">
                  <div class="col-md-8" style="padding: 10px; margin-left: 17%; border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                    
                      <h4>닉네임: </h4>
                      <h3 style="margin-left: 30px;"> ${nickname}</h3>
                      <br>
                      <h4>이메일: </h4>
                      <h3 style="margin-left: 30px;">${data[i].email} </h3 >
                      <br>
                      <h4>전화번호: </h4>
                      <h3 style="margin-left: 7px;">  ${data[i].phone}</h3>
                    </div>
                   
                </div>
              </div>`
        }

       ;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
                alert(error.response.data.message);
      window.location.reload();
            }
    });
}

else if (window.location.href === 'http://localhost:3000/category'){

  axios
    .get(`http://localhost:3000/categorySearch?search=${search}`)
    .then((res) => {
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {

        document.getElementById(`bb`).innerHTML = "";

        // 검색어 배경색 적용
        const name = data[i].name.replace(
          new RegExp(`(${search})`, 'gi'),
          '<span style="background-color: yellow">$1</span>',
        );

        temp += `<div class="container-fluid" style=" margin-top: 20px;" >
                <div class="row" id="categoryList${data[i].id}">
                  <div class="col-md-2" id="image-container"></div>  
                  <div class="col-md-8" style="padding-bottom: 10px; padding-top: 15px;border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                      <h4>카테고리:</h4>
                      <h3 id="cat-name"> ${name}</h3>
                      <br>
                      <br>
                      <button class="category-btn" id="updateCategory-btn" onclick="updateCategory(${data[i].id}, '${data[i].name}')"> 수정 </button>
                    <button class="category-btn" style="float: right;" onclick="deleteCategory(${data[i].id})">삭제</button>
                    </div>
                </div>
              </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
                alert(error.response.data.message);
      window.location.reload();
            }
    });

}

else if (window.location.href === 'http://localhost:3000/notice'){

  axios
    .get(`http://localhost:3000/noticeSearch?search=${search}`)
    .then((res) => {
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {

        document.getElementById(`bb`).innerHTML = "";

        // 검색어 배경색 적용
        const title = data[i].title.replace(
          new RegExp(`(${search})`, 'gi'),
          '<span style="background-color: yellow">$1</span>',
        );

        temp += ` <div class="container-fluid" style=" margin-top: 20px;" onclick="getNotice(${data[i].id})">
                <div class="row">
                  <div class="col-md-2" id="image-container"></div> 
                    <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                      <h3>${title}</h3>
                      <br>
                    </div>
                </div>
              </div>`;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
                alert(error.response.data.message);
      window.location.reload();
            }
    });

}
else if (window.location.href === 'http://localhost:3000/reports'){
  // window.removeEventListener('scroll', debouncedPageReport);
//신고 검색
    axios
    .get(`http://localhost:3000/reportSearch?search=${search}`)
    .then((res) => {
      let data = res.data.data;
      let temp = '';
      for (let i = 0; i < data.length; i++) {

        document.getElementById(`bb`).innerHTML = "";

        // 검색어 배경색 적용
        const title = data[i].title.replace(
          new RegExp(`(${search})`, 'gi'),
          '<span style="background-color: yellow">$1</span>',
        );

        if (data[i].status === 1) {

           temp += `<div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${data[i].id})">
           <div class="row">
             <div class="col-md-2" id="image-container"></div> 
               <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                 <h3>${title}</h3>
                 <span style="float: right;"> ✅ </span>
               </div>
           </div>
         </div>`
        }

        else{
          temp += `<div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${data[i].id})">
           <div class="row">
             <div class="col-md-2" id="image-container"></div> 
               <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                 <h3>${title}</h3>
                 <span style="float: right;"> ❌ </span>
               </div>
           </div>
         </div>`
        }

       ;
      }
      document.getElementById('bb').innerHTML = temp;
    })
    .catch((error) => {
      if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
                alert(error.response.data.message);
      window.location.reload();
            }
    });
}

else{
  alert( '이 페이지에서는 검색이 불가능 합니다.')
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