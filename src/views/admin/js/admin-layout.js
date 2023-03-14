
//로그인 
function login() {
    const loginId = document.getElementById('id').value;
    const loginPw = document.getElementById('password').value;

    axios
        .post('http://localhost:3000/admin/login',
            { loginId: loginId, loginPw: loginPw }
        )
        .then((res) => {
            // 응답처리
            alert(res.data)
            window.location.replace("http://localhost:3000/products")
        })
        .catch((error) => {
            // 예외처리
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
        });
}


//상품 상세 보기
function getProduct (productId) {
    axios
            .get('http://localhost:3000/products')
            .then((res) => {
               window.location.replace(`http://localhost:3000/products/${productId}`)
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                console.log(error)
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
       
    }

// 상품삭제하기
function deleteProduct(productId){

    if(confirm('정말 삭제하시겠습니까?')){ 

    axios
    .delete(`/products/${productId}`)
    .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message))
        window.location.replace("http://localhost:3000/products")
    })
    .catch((error) => {
        if (error.response.status === 401) {
                alert('로그인하셔야 합니다.');
                window.location.href = '/admin/login'
            }
        else{
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
        }
        // 예외처리
        
    });
}      
}

//회원 상세 보기


function getUser (userId) {
    axios
          .get('http://localhost:3000/users')
          .then((res) => {
            window.location.replace(`http://localhost:3000/users/${userId}`)
              })
          .catch((error) => {
              // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
              console.log(error)
              if (error.response.status === 401) {
                  alert('로그인하셔야 합니다.');
                  window.location.href = '/admin/login'
              }})
  }

  //블랙리스트 목록 불러오기
  function getBan() {
    axios
  .get('http://localhost:3000/ban/users')
  .then((res) => {
    console.log(res.data.banUsers)
    const banUsers = res.data.banUsers
    let temp = '';
    for (let i = 0; i < banUsers.length; i++) {
        document.getElementById(`bb`).innerHTML = "";

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
            </div>`

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
  })

  }

  //밴 처리 하기 

  function banUser(userId, ban){
    axios
    .put(`/users/${userId}`, 
    { userId: userId, ban: ban}
    )
    .then((res) => {
        alert(JSON.stringify(res.data))
        window.location.replace(`/users/${userId}`)
    })
    .catch((error) => {
        if (error.response.status === 401) {
                alert('로그인하셔야 합니다.');
                window.location.href = '/admin/login'
            }
        else{
           alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message); 
        }
    });
}

// 회원 정보 삭제 

function deleteUser(userId){
    if(confirm('정말 삭제하시겠습니까?')){ 
    axios
    .delete(`/users/${userId}`)
    .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message))
        window.location.replace("http://localhost:3000/users")
    })
    .catch((error) => {
        if (error.response.status === 401) {
                alert('로그인하셔야 합니다.');
                window.location.href = '/admin/login'
            }
        else{
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
        }
    });
}    
}



//카테고리 수정
function updateCategory (categoryId, name) {
    console.log(111, categoryId, name)
      
      document.getElementById(`categoryList${categoryId}`).innerHTML = "";
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
           
                  `
      document.getElementById(`categoryList${categoryId}`).innerHTML = temp_html;
  }

  //카테고리 수정 완료
  function completeUpdate(categoryId){
      const name =  document.getElementById('tq').value;
      axios
      .put(`http://localhost:3000/category/${categoryId}`,
          { name: name}
      )
      .then((res) => {
          // 응답처리
          
          alert(JSON.stringify(res.data))
          window.location.replace("http://localhost:3000/category")
      })
      .catch((error) => {
        if (error.response.status === 401) {
                  alert('로그인하셔야 합니다.');
                  window.location.href = '/admin/login'
              }
          else{alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);}
          // 예외처리
          
      });
  }

  // 카테고리 수정 취소
  function cancleUpdate(){
    axios
    .get('http://localhost:3000/category')
    .then((res)=> window.location.reload())
    .catch((error) => { if (error.response.status === 401) {
                  alert('로그인하셔야 합니다.');
                  window.location.href = '/admin/login'
              }}
     )
  }

 //카테고리 삭제 

  function deleteCategory(categoryId){
      if(confirm('정말 삭제하시겠습니까?')){ 
      axios
      .delete(`/category/${categoryId}`)
      .then((res) => {
          // 응답처리
          alert(JSON.stringify(res.data.message))
          window.location.replace("http://localhost:3000/category")
      })
      .catch((error) => {
          // 예외처리
          if (error.response.status === 401) {
                  alert('로그인하셔야 합니다.');
                  window.location.href = '/admin/login'
              }
            else{ alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);}
      });
  }    
  }

  //카테고리 작성 페이지 가기
  function createCategoryPage(){
    axios
          .get('http://localhost:3000/category')
          .then((res) => {
            window.location.replace("http://localhost:3000/post/category")
              })
          .catch((error) => {
              // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
              console.log(error)
              if (error.response.status === 401) {
                  alert('로그인하셔야 합니다.');
                  window.location.href = '/admin/login'
              }})
  }

  //카테고리 작성 완료
  function createCategory() {
    const name = document.getElementById('name').value;
    axios
        .post('http://localhost:3000/category',
            { name: name}
        )
        .then((res) => {
            // 응답처리
            alert(JSON.stringify(res.data))
            window.location.replace("http://localhost:3000/category")
        })
        .catch((error) => {
          if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);}
        });
}

//카테고리 작성 취소

function cancleCategory() {
    axios
              .get('http://localhost:3000/post/category')
              .then((res) => {
                window.location.replace("http://localhost:3000/category")
                  })
              .catch((error) => {
                  // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                  console.log(error)
                  if (error.response.status === 401) {
                      alert('로그인하셔야 합니다.');
                      window.location.href = '/admin/login'
                  }})
    }

// 공지 상세 보기 
    function getNotice (noticeId) {
        axios
                    .get('http://localhost:3000/notice')
                    .then((res) => {
                    window.location.replace(`http://localhost:3000/notice/${noticeId}`)
                        })
                    .catch((error) => {
                        // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                        console.log(error)
                        if (error.response.status === 401) {
                            alert('로그인하셔야 합니다.');
                            window.location.href = '/admin/login'
                        }})
                
            }

    // 공지사항 작성 페이지로 가기 
            function createNoticePage(){
            axios
                    .get('http://localhost:3000/notice')
                    .then((res) => {
                    window.location.replace("http://localhost:3000/post/notice")
                        })
                    .catch((error) => {
                        // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                        console.log(error)
                        if (error.response.status === 401) {
                            alert('로그인하셔야 합니다.');
                            window.location.href = '/admin/login'
                        }})
            }


 // 공지 작성 완료
 function createNotice() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    axios
        .post('http://localhost:3000/notice',
            { title: title, description: description}
        )
        .then((res) => {
            // 응답처리
            alert(JSON.stringify(res.data))
            window.location.replace("http://localhost:3000/notice")
        })
        .catch((error) => {
            if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
            }
        });
}


// 공지 작성 취소
    function cancleNotice() {
    axios
            .get('http://localhost:3000/users')
            .then((res) => {
                window.location.replace("http://localhost:3000/notice")
                })
            .catch((error) => {
                // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                console.log(error)
                if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }})
            }
            
 // 공지 수정하기 
 function updateNotice (noticeId, title , description) {
        
    document.getElementById("noticeInfo").innerHTML = "";
    document.getElementById("noticeFooter").innerHTML = "";
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
    
    `
    let temp_footer =`
    <div class="col" style="height: 40px; width: 20%"></div>
        <div class="col" style="height: 40px; width: 20%"> <button class="footer-btn" onclick ="completeUpdateNotice(${noticeId})">수정완료</button><br></div>
        <div class="col" style="height: 40px; width: 20%"></div>
        <div class="col" style="height: 40px; width: 20%"><button class="footer-btn" onclick ="cancleUpdate()">취소</button><br></div>
        <div class="col" style="height: 40px; width: 20%"></div>
    `
    document.getElementById("noticeInfo").innerHTML = temp_html;
    document.getElementById("noticeFooter").innerHTML = temp_footer;
}

//공지 수정 완료
    function completeUpdateNotice(noticeId){
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        axios
        .put(`http://localhost:3000/notice/${noticeId}`,
        { title: title, description: description}
        )
        .then((res) => {
            // 응답처리
            alert(JSON.stringify(res.data))
            window.location.replace(`http://localhost:3000/notice/${noticeId}`)
        })
        .catch((error) => {
            if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
            }
        });
    }

//공지 수정 취소

function cancleUpdate(){
    axios
    .get('http://localhost:3000/notice')
    .then((res)=> window.location.reload())
    .catch((error) => { if (error.response.status === 401) {
                  alert('로그인하셔야 합니다.');
                  window.location.href = '/admin/login'
              }}
     )
  }

//공지 삭제 
    function deleteNotice(noticeId){
        if(confirm('정말 삭제하시겠습니까?')){ 
        axios
        .delete(`/notice/${noticeId}`)
        .then((res) => {
            // 응답처리
            alert(JSON.stringify(res.data.message))
            window.location.replace("http://localhost:3000/notice")
        })
        .catch((error) => {
            if (error.response.status === 401) {
                    alert('로그인하셔야 합니다.');
                    window.location.href = '/admin/login'
                }
            else{
            alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
            }
        });
    }    
    }

// 상품 페이지네이션

 //버튼으로 
// function pageProduct(productsLength, totalProducts){
//     console.log(productsLength)
//     console.log(totalProducts)
    
//       const loadMoreBtn = document.getElementById('load-more-btn');
//         const limit = Number(loadMoreBtn.getAttribute('data-limit')) 
//         const offset = Number(loadMoreBtn.getAttribute('data-offset'));
      
//         axios.get('/api/products?limit=' + limit + '&offset=' + offset )
//               .then(function(res) {
                
//                 loadMoreBtn.remove()
//                 const products = res.data.products
//                 console.log(products)
//                 let temp = '';
//                 for (let i = 0; i < products.length; i++) {
                
//                   temp += `
//                   <div class="container-fluid" style=" margin-top: 20px;" onclick="getProduct(${products[i].id})">
//                     <div class="row" style="cursor: pointer; "  >
//                       <div class="col-md-3" style="margin-left: 13%;" id="image-container">
//                         <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="spcFuck" id="image"/>
//                       </div>
//                       <div class="col-md-8" id="products-column" >
//                           <h3 >${products[i].title} </h3>
//                           <h3> ${products[i].price}원</h3>
//                           <br>
//                           <span style="float: right;">❤ ${products[i].likes}</span>
//                           <span style="float: right;">🎯 ${products[i].dealCount} &nbsp </span>
//                           <span style="float: right;">👀:${products[i].viewCount}회 &nbsp</span>
                          
//                         </div>
//                     </div>
//                   </div>
//                   `
//                 }
//                 $('#bb').append(temp)
                
    
//                  if (products.length < res.data.totalProducts) {
//                   const newLength = products.length + productsLength
//                   const TotalProducts = res.data.totalProducts
//                   const loadMoreBtn = `
//                     <div class="text-center mt-3">
//                       <button onclick="pageProduct(${newLength}, ${TotalProducts})" id="load-more-btn" class="btn btn-primary load-more" data-limit="${newLength}" data-offset="${newLength}"> 더 보기 </button>
//                     </div>
//                   `
//                   $('#bb').append(loadMoreBtn)
//                  }
//               })
//               .catch(function(error) {
//                 if (productsLength === totalProducts){
//                   alert('끝') 
//                  }
//                  else if (error.response.status === 401) {
//                         alert('로그인하셔야 합니다.');
//                         window.location.href = '/admin/login'
//                     }
//                  else{
//                    alert('데이터를 불러오는 중 오류가 발생했습니다.');
//                  }
//               });
//             }

//상품 무한 스크롤 
function debounce(func, wait = 5, immediate = false) {
    let timeout;
    return function() {
      const context = this
      const args = arguments
  
      const later = function() {
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
  
  // A delay of 50ms between calls.
  const debouncedPageProduct = debounce(pageProduct, 50);
  
  window.addEventListener('scroll', debouncedPageProduct);
  
  function pageProduct() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
  
      const totalProducts = TotalProducts
      const productsLength = limit
      console.log(productsLength)
      console.log(totalProducts)
  
      axios.get(`/api/products?limit=${limit}&offset=${offset}`)
        .then(res => {
          const products = res.data.products;
          console.log(products)
          let temp = '';
          for (let i = 0; i < products.length; i++) {
            temp += `
              <div class="container-fluid" style="margin-top: 20px;" onclick="getProduct(${products[i].id})">
                <div class="row" style="cursor: pointer;">
                  <div class="col-md-3" style="margin-left: 13%;" id="image-container">
                    <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="spcFuck" id="image"/>
                  </div>
                  <div class="col-md-8" id="products-column">
                    <h3>${products[i].title}</h3>
                    <h3>${products[i].price}원</h3>
                    <br>
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
  
                    limit += products.length
  
                   offset += products.length
                   }
        })
        .catch(error => {
                  if (productsLength === totalProducts){
                    alert('끝 페이지입니다.') 
                    window.removeEventListener('scroll', debouncedPageProduct);
                   }
                   else if (error.response.status === 401) {
                          alert('로그인하셔야 합니다.');
                          window.location.href = '/admin/login'
                      }
                   else{
                     alert('데이터를 불러오는 중 오류가 발생했습니다.');
                   }
        });
    }
  };



    