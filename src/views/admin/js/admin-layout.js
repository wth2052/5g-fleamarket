//로그인
function login() {
  const loginId = document.getElementById('id').value;
  const loginPw = document.getElementById('password').value;

  axios
    .post('/api/admin/login', {
      loginId: loginId,
      loginPw: loginPw,
    })
    .then((res) => {
      // 응답처리
      alert(res.data);
      window.location.replace('/admin/products');
    })
    .catch((error) => {
      // 예외처리
      alert(
        error.response?.data?.message ||
          error.response.data.errorMessage.details[0].message,
      );
    });
}

//상품 상세 보기
function getProduct(productId) {
  axios
    .get('/admin/products')
    .then((res) => {
      window.location.replace(
        `/admin/products/${productId}`,
      );
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

// 상품삭제하기
function deleteProduct(productId) {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios
      .delete(`/api/admin/products/${productId}`)
      .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message));
        window.location.replace('/admin/products');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(
            error.response?.data?.message ||
              error.response.data.errorMessage.details[0].message,
          );
        }
        // 예외처리
      });
  }
}

//회원 상세 보기

function getUser(userId) {
  axios
    .get('/users')
    .then((res) => {
      window.location.replace(`/users/${userId}`);
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

//밴 처리 하기

function banUser(userId, ban) {
  axios
    .put(`/api/users/${userId}`, { userId: userId, ban: ban })
    .then((res) => {
      alert(JSON.stringify(res.data));
      window.location.replace(`/users/${userId}`);
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      } else {
        alert(
          error.response?.data?.message ||
            error.response.data.errorMessage.details[0].message,
        );
      }
    });
}

// 회원 정보 삭제

function deleteUser(userId) {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios
      .delete(`/api/users/${userId}`)
      .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message));
        window.location.replace('/users');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(
            error.response?.data?.message ||
              error.response.data.errorMessage.details[0].message,
          );
        }
      });
  }
}

//카테고리 수정
function updateCategory(categoryId, name) {
  console.log(111, categoryId, name);

  document.getElementById(`categoryList${categoryId}`).innerHTML = '';
  let temp_html = `
      
              <div class="row" id="categoryList${categoryId}">
                <div class="col-md-2" id="image-container"></div>  
                <div class="col-md-8" style="padding-bottom: 10px; padding-top: 15px; border: 3px dotted #5cd7f2; border-radius: 3px;">
                    <h4>카테고리: </h4>
                    <input type="text" id="tq" style="height:45px;" value= "${name}">
                    <br>
                    <br>
                  <button class="category-btn" style="float: left;" onclick ="completeUpdate(${categoryId})">수정완료</button> 
                  <button class="category-btn" style="float: right;" onclick ="cancleUpdate()">취소</button>
                </div>
              </div>
           
                  `;
  document.getElementById(`categoryList${categoryId}`).innerHTML = temp_html;
}

//카테고리 수정 완료
function completeUpdate(categoryId) {
  const name = document.getElementById('tq').value;
  axios
    .put(`/api/category/${categoryId}`, { name: name })
    .then((res) => {
      // 응답처리

      alert(JSON.stringify(res.data));
      window.location.replace('/category');
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      } else {
        alert(
          error.response?.data?.message ||
            error.response.data.errorMessage.details[0].message,
        );
      }
      // 예외처리
    });
}

// 카테고리 수정 취소
function cancleUpdate() {
  axios
    .get('/category')
    .then((res) => window.location.reload())
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

//카테고리 삭제

function deleteCategory(categoryId) {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios
      .delete(`/api/category/${categoryId}`)
      .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message));
        window.location.replace('/category');
      })
      .catch((error) => {
        // 예외처리
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(
            error.response?.data?.message ||
              error.response.data.errorMessage.details[0].message,
          );
        }
      });
  }
}

//카테고리 작성 페이지 가기
function createCategoryPage() {
  axios
    .get('/category')
    .then((res) => {
      window.location.replace('/post/category');
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

//카테고리 작성 완료
function createCategory() {
  const name = document.getElementById('name').value;
  axios
    .post('/api/category', { name: name })
    .then((res) => {
      // 응답처리
      alert(JSON.stringify(res.data));
      window.location.replace('/category');
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      } else {
        alert(
          error.response?.data?.message ||
            error.response.data.errorMessage.details[0].message,
        );
      }
    });
}

//카테고리 작성 취소

function cancleCategory() {
  axios
    .get('/post/category')
    .then((res) => {
      window.location.replace('/category');
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

// 공지 상세 보기
function getNotice(noticeId) {
  axios
    .get('/notice')
    .then((res) => {
      window.location.replace(
        `/notice/${noticeId}`,
      );
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

// 공지사항 작성 페이지로 가기
function createNoticePage() {
  axios
    .get('/notice')
    .then((res) => {
      window.location.replace('/post/notice');
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

// 공지 작성 완료
function createNotice() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  axios
    .post('/api/notice', {
      title: title,
      description: description,
    })
    .then((res) => {
      // 응답처리
      alert(JSON.stringify(res.data));
      window.location.replace('/notice');
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      } else {
        alert(
          error.response?.data?.message ||
            error.response.data.errorMessage.details[0].message,
        );
      }
    });
}

// 공지 작성 취소
function cancleNotice() {
  axios
    .get('/users')
    .then((res) => {
      window.location.replace('/notice');
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

// 공지 수정하기
function updateNotice(noticeId, title, description) {
  document.getElementById('noticeInfo').innerHTML = '';
  document.getElementById('noticeFooter').innerHTML = '';
  let temp_html = `
    <div class="col-md-2" id="image-container"></div>  
    <div class="col-md-8" style="border: 1px solid #05AFF2; border-radius: 3px; padding-left: 15%; padding-top: 20px; padding-bottom: 17%;" >
        <h5>제목 : <br></h5>
                <input type="text" id="title" value="${title}"> 
                <br>
                <br>
                <h5>내용: <br></h5>
                <textarea  id="description" style="width:80%; height: 100%">${description}</textarea>
</div>  
        </div>  
    
    `;
  let temp_footer = `
    <div class="col" style="height: 40px; width: 20%"></div>
        <div class="col" style="height: 40px; width: 20%"> <button class="footer-btn" onclick ="completeUpdateNotice(${noticeId})">수정완료</button><br></div>
        <div class="col" style="height: 40px; width: 20%"></div>
        <div class="col" style="height: 40px; width: 20%"><button class="footer-btn" onclick ="cancleUpdate()">취소</button><br></div>
        <div class="col" style="height: 40px; width: 20%"></div>
    `;
  document.getElementById('noticeInfo').innerHTML = temp_html;
  document.getElementById('noticeFooter').innerHTML = temp_footer;
}

//공지 수정 완료
function completeUpdateNotice(noticeId) {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  axios
    .put(`/api/notice/${noticeId}`, {
      title: title,
      description: description,
    })
    .then((res) => {
      // 응답처리
      alert(JSON.stringify(res.data));
      window.location.replace(
        `/notice/${noticeId}`,
      );
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      } else {
        alert(
          error.response?.data?.message ||
            error.response.data.errorMessage.details[0].message,
        );
      }
    });
}

//공지 수정 취소

function cancleUpdate() {
  axios
    .get('/notice')
    .then((res) => window.location.reload())
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

//공지 삭제
function deleteNotice(noticeId) {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios
      .delete(`/api/notice/${noticeId}`)
      .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message));
        window.location.replace('/notice');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(
            error.response?.data?.message ||
              error.response.data.errorMessage.details[0].message,
          );
        }
      });
  }
}


function debounce(func, wait = 5, immediate = false) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;

    const later = function () {
      // sets timeout to null so that a new timeout can be set after the function has been called
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    //'immediate' determines whether the function should be called immediately or after the delay.
    //when immediate = true, the function is executed immediately
    //we can set 'wait',which specifies the delay between calls, for the wait interval before executing the function again.
    //This means that the function is executed first (immediately), then have the delay.
    //I put immediate = false, to have a delay first then the function to be executed.

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

if (document.location.href.split('/')[3] === 'admin') {
  //상품 무한 스크롤

  let limit = Number(document.getElementById('productsLength').value);
  let offset = Number(document.getElementById('productsLength').value);
  let TotalProducts = Number(document.getElementById('totalProducts').value);
  // A delay of 50ms between calls.
  const debouncedPageProduct = debounce(pageProduct, 50);

  window.addEventListener('scroll', debouncedPageProduct);

  function pageProduct() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const totalProducts = TotalProducts;
      const productsLength = limit;
      console.log(productsLength);
      console.log(totalProducts);

      axios
        .get(`/api/admin/products?limit=${limit}&offset=${offset}`)
        .then((res) => {
          const products = res.data.products;
          console.log(products);
          let temp = '';
          for (let i = 0; i < products.length; i++) {
            temp += `
              <div class="container-fluid" style="margin-top: 20px;" onclick="getProduct(${products[i].id})">
                <div class="row" style="cursor: pointer;">
                  <div class="col-md-3" style="margin-left: 13%;" id="image-container">

                    <img src="/img/${products[i].images[0].imagePath}" alt="image" id="image"/>
                  </div>
                  <div class="col-md-8" id="products-column">
                    <h3>${products[i].title}</h3>
                    <h3>${products[i].price}원</h3>
                    <br>
                    <span>작성자: ${products[i].seller.nickname}</span>
                    <span style="float: right;">❤ ${products[i].likes}</span>
                    <span style="float: right;">🎯 ${products[i].dealCount} &nbsp </span>
                    <span style="float: right;">👀:${products[i].viewCount}회 &nbsp</span>
                  </div>
                </div>
              </div>
            `;
          }
          $('#bb').append(temp);

          if (products.length < res.data.totalProducts) {
            limit += products.length;

            offset += products.length;
          }
        })
        .catch((error) => {
          if (productsLength === totalProducts) {
            alert('끝 페이지입니다.');
            window.removeEventListener('scroll', debouncedPageProduct);
          } else if (error.response.status === 401) {
            alert('로그인하셔야 합니다.');
            window.location.href = '/admin/login';
          } else {
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
          }
        });
    }
  }

  //상품 검색
  function search() {
    const search = document.getElementById('search').value;
    axios
      .get(`/api/admin/productSearch?search=${search}`)
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageProduct);
        let data = res.data.data;
        let temp = '';
        for (let i = 0; i < data.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

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

                    <img src="/img/${data[i].images[0].imagePath}" alt="image" id="image"/>

                  </div>
                  <div class="col-md-8" id="products-column" >
                      <h3 > ${title}</h3>
                      <h3>${data[i].price} 원</h3>
                      <br>
                      <span>작성자: ${data[i].seller.nickname}</span>
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
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }
} else if (document.location.href.split('/')[3] === 'users') {
  let limit = Number(document.getElementById('usersLength').value);
  let offset = Number(document.getElementById('usersLength').value);
  let TotalUsers = Number(document.getElementById('totalUsers').value);
  //회원 페이지네이션
  // A delay of 50ms between calls.
  const debouncedPageUser = debounce(pageUser, 50);

  window.addEventListener('scroll', debouncedPageUser);

  function pageUser() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const totalUsers = TotalUsers;
      const usersLength = limit;
      console.log(usersLength);
      console.log(totalUsers);

      axios
        .get(`/api/users?limit=${limit}&offset=${offset}`)
        .then((res) => {
          const users = res.data.users;
          console.log(users);
          let temp = '';

          for (let i = 0; i < users.length; i++) {
            if (users[i].ban === 1) {
              temp += `
                          <div class="container-fluid" style=" margin-top: 20px;" onclick="getUser(${users[i].id})">
                            <div class="row">
                              <div class="col-md-8" style="padding: 10px; margin-left: 17%; border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                                
                                  <h4>닉네임: </h4>
                                  <h3 style="margin-left: 30px;"> ${users[i].nickname}</h3>
                                  <br>
                                  <h4>이메일: </h4>
                                  <h3 style="margin-left: 30px;">${users[i].email} </h3 >
                                  <br>
                                  <h4>전화번호: </h4>
                                  <h3 style="margin-left: 7px;">  ${users[i].phone}</h3>
                                <span style="float: right;margin-top:45px" class="blacklist">😡블랙리스트</span>
                                </div>
                              
                            </div>
                          </div>
                        `;
            } else {
              temp += `
                          <div class="container-fluid" style=" margin-top: 20px;" onclick="getUser(${users[i].id})">
                            <div class="row">
                              <div class="col-md-8" style="padding: 10px; margin-left: 17%; border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                                
                                  <h4>닉네임: </h4>
                                  <h3 style="margin-left: 30px;"> ${users[i].nickname}</h3>
                                  <br>
                                  <h4>이메일: </h4>
                                  <h3 style="margin-left: 30px;">${users[i].email} </h3 >
                                  <br>
                                  <h4>전화번호: </h4>
                                  <h3 style="margin-left: 7px;">  ${users[i].phone}</h3>
                                <span style="float: right;margin-top:45px" class="blacklist"></span>
                                </div>
                              
                            </div>
                          </div>
                        `;
            }
          }

          $('#bb').append(temp);

          if (users.length < res.data.totalUsers) {
            limit += users.length;

            offset += users.length;
          }
        })
        .catch((error) => {
          if (usersLength === totalUsers) {
            alert('끝 페이지입니다.');
            window.removeEventListener('scroll', debouncedPageUser);
          } else if (error.response.status === 401) {
            alert('로그인하셔야 합니다.');
            window.location.href = '/admin/login';
          } else {
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
          }
        });
    }
  }

  //블랙리스트 목록 불러오기
  function getBan() {
    axios
      .get('/api/ban/users')
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageUser);
        console.log(res.data.banUsers);
        const banUsers = res.data.banUsers;
        let temp = '';
        for (let i = 0; i < banUsers.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

          temp += `<div class="container-fluid" style=" margin-top: 20px;" onclick="getUser(${banUsers[i].id})">
              <div class="row">
                <div class="col-md-8" style="padding: 10px; margin-left: 17%; border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                  
                    <h4>닉네임: </h4>
                    <h3 style="margin-left: 30px;"> ${banUsers[i].nickname}</h3>
                    <br>
                    <h4>이메일: </h4>
                    <h3 style="margin-left: 30px;">${banUsers[i].email} </h3 >
                    <br>
                    <h4>전화번호: </h4>
                    <h3 style="margin-left: 7px;">  ${banUsers[i].phone}</h3>
                    <span style="float: right;margin-top:45px"> 😡블랙리스트 </span>
                  </div>
                 
              </div>
            </div>`;
        }
        document.getElementById('bb').innerHTML = temp;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }

  //회원 검색
  function search() {
    const search = document.getElementById('search').value;

    axios
      .get(`/api/userSearch?search=${search}`)
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageUser);
        let data = res.data.data;
        let temp = '';
        for (let i = 0; i < data.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

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
            </div>`;
          } else {
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
            </div>`;
          }
        }
        document.getElementById('bb').innerHTML = temp;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }
} else if (document.location.href.split('/')[3] === 'category') {
  //카테고리 페이지네이션
  let limit = Number(document.getElementById('categoryLength').value);
  let offset = Number(document.getElementById('categoryLength').value);
  let TotalCategory = Number(document.getElementById('totalcategory').value);

  // A delay of 50ms between calls.
  const debouncedPageCategory = debounce(pageCategory, 50);

  window.addEventListener('scroll', debouncedPageCategory);

  function pageCategory() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const totalCategory = TotalCategory;
      const categoryLength = limit;
      console.log(categoryLength);
      console.log(totalCategory);

      axios
        .get(`/api/category?limit=${limit}&offset=${offset}`)
        .then((res) => {
          const category = res.data.category;
          console.log(category);
          let temp = '';
          for (let i = 0; i < category.length; i++) {
            temp += `
          <div class="container-fluid" style=" margin-top: 20px;" >
          <div class="row" id="categoryList${category[i].id}">
            <div class="col-md-2" id="image-container"></div>  
            <div class="col-md-8" style="padding-bottom: 10px; padding-top: 15px;border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                <h4>카테고리:</h4>
                <h3 id="cat-name"> ${category[i].name}</h3>
                <br>
                <br>
                <button class="category-btn" id="updateCategory-btn" onclick="updateCategory(${category[i].id}, '${category[i].name}')">수정</button>
              <button class="category-btn" style="float: right;" onclick="deleteCategory(${category[i].id})">삭제</button>
              </div>
          </div>
        </div>
          `;
          }
          $('#bb').append(temp);

          if (category.length < res.data.totalcategory) {
            limit += category.length;

            offset += category.length;
          }
        })
        .catch((error) => {
          if (categoryLength === totalCategory) {
            alert('끝 페이지입니다.');
            window.removeEventListener('scroll', debouncedPageCategory);
          } else if (error.response.status === 401) {
            alert('로그인하셔야 합니다.');
            window.location.href = '/admin/login';
          } else {
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
          }
        });
    }
  }

  //카테고리 검색
  function search() {
    const search = document.getElementById('search').value;

    axios
      .get(`/api/categorySearch?search=${search}`)
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageCategory);
        let data = res.data.data;
        let temp = '';
        for (let i = 0; i < data.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

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
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }
} else if (document.location.href.split('/')[3] === 'notice') {
  //공지 페이지네이션
  let limit = Number(document.getElementById('noticeLength').value);
  let offset = Number(document.getElementById('noticeLength').value);
  let TotalNotice = Number(document.getElementById('totalNotice').value);

  // A delay of 50ms between calls.
  const debouncedPageNotice = debounce(pageNotice, 50);

  window.addEventListener('scroll', debouncedPageNotice);

  function pageNotice() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const totalNotice = TotalNotice;
      const noticeLength = limit;
      console.log(noticeLength);
      console.log(totalNotice);

      axios
        .get(`/api/notice?limit=${limit}&offset=${offset}`)
        .then((res) => {
          const notices = res.data.notices;
          console.log(notices);
          let temp = '';
          for (let i = 0; i < notices.length; i++) {
            temp += `
            <div class="container-fluid" style=" margin-top: 20px;" onclick="getNotice(${notices[i].id})">
            <div class="row">
              <div class="col-md-2" id="image-container"></div> 
                <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                  <h3>${notices[i].title}</h3>
                  <br>
                </div>
            </div>
          </div>
            `;
          }
          $('#bb').append(temp);

          if (notices.length < res.data.totalNotice) {
            limit += notices.length;

            offset += notices.length;
          }
        })
        .catch((error) => {
          if (noticeLength === totalNotice) {
            alert('끝 페이지입니다.');
            window.removeEventListener('scroll', debouncedPageNotice);
          } else if (error.response.status === 401) {
            alert('로그인하셔야 합니다.');
            window.location.href = '/admin/login';
          } else {
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
          }
        });
    }
  }

  //공지 검색

  function search() {
    const search = document.getElementById('search').value;

    axios
      .get(`/api/noticeSearch?search=${search}`)
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageNotice);
        let data = res.data.data;
        let temp = '';
        for (let i = 0; i < data.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

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
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }
} else if (document.location.href.split('/')[3] === 'reports') {
  //신고 페이지네이션
  let limit = Number(document.getElementById('reportsLength').value);
  let offset = Number(document.getElementById('reportsLength').value);
  let TotalReports = Number(document.getElementById('totalReports').value);

  // A delay of 50ms between calls.
  const debouncedPageReport = debounce(pageReport, 50);

  window.addEventListener('scroll', debouncedPageReport);

  function pageReport() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const totalReports = TotalReports;
      const reportsLength = limit;
      console.log(reportsLength);
      console.log(totalReports);

      axios
        .get(`/api/reports?limit=${limit}&offset=${offset}`)
        .then((res) => {
          const reports = res.data.reports;
          console.log(reports);
          let temp = '';
          for (let i = 0; i < reports.length; i++) {
            if (reports[i].status === 1) {
              temp += `
                        <div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${reports[i].id})">
                        <div class="row">
                          <div class="col-md-2" id="image-container"></div> 
                            <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                              <h3>${reports[i].title}</h3>
                              <span style="float: right;">✅</span>
                            </div>
                        </div>
                      </div>
                    `;
            } else if (reports[i].status === 0) {
              temp += `
              <div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${reports[i].id})">
              <div class="row">
                <div class="col-md-2" id="image-container"></div> 
                  <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                    <h3>${reports[i].title}</h3>
                    <span style="float: right;">❌</span>
                  </div>
              </div>
            </div>
          `;
            }
          }
          $('#bb').append(temp);
          if (reports.length < res.data.totalReports) {
            limit += reports.length;

            offset += reports.length;
          }
        })
        .catch((error) => {
          if (reportsLength === totalReports) {
            alert('끝 페이지입니다.');
            window.removeEventListener('scroll', debouncedPageReport);
          } else if (error.response.status === 401) {
            alert('로그인하셔야 합니다.');
            window.location.href = '/admin/login';
          } else {
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
          }
        });
    }
  }

  //확인안된 신고목록 불러오기
  function getUncheckedReport() {
    axios
      .get('/reports')
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageReport);
        console.log(res.data.uncheckedReports);
        const uncheckedReports = res.data.uncheckedReports;
        let temp = '';
        for (let i = 0; i < uncheckedReports.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

          temp += `
      <div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${uncheckedReports[i].id})">
              <div class="row">
                <div class="col-md-2" id="image-container"></div> 
                  <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                    <h3>${uncheckedReports[i].title}</h3>
                    <span style="float: right;">❌</span>
                  </div>
              </div>
            </div>
      `;
        }
        document.getElementById('bb').innerHTML = temp;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }

  //확인된 신고목록 불러오기
  function getCheckedReport() {
    axios
      .get('/api/checked/reports')
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageReport);
        console.log(res.data.checkedReports);
        const checkedReports = res.data.checkedReports;
        let temp = '';
        for (let i = 0; i < checkedReports.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

          temp += `
      <div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${checkedReports[i].id})">
              <div class="row">
                <div class="col-md-2" id="image-container"></div> 
                  <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
                    <h3>${checkedReports[i].title}</h3>
                    <span style="float: right;">✅</span>
                  </div>
              </div>
            </div>
      `;
        }
        document.getElementById('bb').innerHTML = temp;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }

  //신고 검색
  function search() {
    const search = document.getElementById('search').value;
    axios
      .get(`/api/reportSearch?search=${search}`)
      .then((res) => {
        window.removeEventListener('scroll', debouncedPageReport);
        let data = res.data.data;
        let temp = '';
        for (let i = 0; i < data.length; i++) {
          document.getElementById(`bb`).innerHTML = '';

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
     </div>`;
          } else {
            temp += `<div class="container-fluid" style=" margin-top: 20px;" onclick="getReport(${data[i].id})">
       <div class="row">
         <div class="col-md-2" id="image-container"></div> 
           <div class="col-md-8" style="border: 3px dotted #5cd7f2; border-radius: 3px; cursor: pointer;">
             <h3>${title}</h3>
             <span style="float: right;"> ❌ </span>
           </div>
       </div>
     </div>`;
          }
        }
        document.getElementById('bb').innerHTML = temp;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(error.response.data.message);
          window.location.reload();
        }
      });
  }
}

//신고 상세 보기
function getReport(reportId) {
  axios
    .get('/reports')
    .then((res) => {
      window.location.replace(
        `/reports/${reportId}`,
      );
    })
    .catch((error) => {
      // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
      console.log(error);
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      }
    });
}

//신고 삭제
function deleteReport(reportId) {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios
      .delete(`/api/reports/${reportId}`)
      .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message));
        window.location.replace('/reports');
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert('로그인하셔야 합니다.');
          window.location.href = '/admin/login';
        } else {
          alert(
            error.response?.data?.message ||
              error.response.data.errorMessage.details[0].message,
          );
        }
      });
  }
}

//신고 확인하기
function checkReport(reportId, status, reported) {
  axios
    .put(`/api/reports/${reportId}`, {
      reportId: reportId,
      status: status,
      reported: reported,
    })
    .then((res) => {
      alert(JSON.stringify(res.data));
      window.location.replace(`/reports/${reportId}`);
    })
    .catch((error) => {
      if (error.response.status === 401) {
        alert('로그인하셔야 합니다.');
        window.location.href = '/admin/login';
      } else {
        alert(
          error.response?.data?.message ||
            error.response.data.errorMessage.details[0].message,
        );
      }
    });
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
