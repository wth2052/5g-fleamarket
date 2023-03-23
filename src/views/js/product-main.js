axios
  .get('http://localhost:3000/products/view')
  .then((res) => {
    let data = res.data;
    let products = data.products;
    let totalProducts = data.totalProducts;
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < products.length; i++) {
        const timeAgo = getTimeAgo(products[i].updatedAt);
        temp += `
                    <div class="container-fluid" onclick="location.href='/products/view/${products[i].id}'" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="img/${products[i].images[0].imagePath}" alt="image" 
                        style="width: 100%; height: 150px; margin: 0" />
                       </div>
                    <div class="col-md-9">
                <h3>${products[i].title}</h3>
                <h4>${products[i].price}원</h4>
                <h6>${timeAgo}</h6>
                <span>조회: ${products[i].viewCount}회</span>
                <br>
                <span style="float: right;">🎯 ${products[i].dealCount} ❤ ${products[i].likes}</span>
            </div>
        </div>
      </div>
      <input type="hidden" value="${products.length}" id="productsLength">
      <input type="hidden" value="${totalProducts}" id="totalProducts">`;
      }
      document.getElementById('bb').innerHTML = temp;

      // 상품 페이지네이션//////////////////////////////////
      function debounce(func, wait = 5, immediate = false) {
        let timeout;
        return function () {
          const context = this
          const args = arguments

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

      let limit = Number(document.getElementById('productsLength').value)
      let offset = Number(document.getElementById('productsLength').value)
      let TotalProducts = Number(document.getElementById('totalProducts').value)

      //   let limit = Number(document.getElementById('productsLength').value)
      // let offset = Number(document.getElementById('productsLength').value)
      // let TotalProducts = Number(document.getElementById('totalProducts').value)
      // A delay of 50ms between calls.
      window.debouncedPageProduct = debounce(pageProduct, 50);

      
window.addEventListener('scroll', debouncedPageProduct);
      
      function pageProduct() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {


          const totalProducts = TotalProducts
          const productsLength = limit

          axios.get(`http://localhost:3000/products/view?limit=${limit}&offset=${offset}`)
            .then(res => {
              const products = res.data.products;
              let temp = '';

              for (let i = 0; i < products.length; i++) {
                const timeAgo = getTimeAgo(products[i].updatedAt);

                temp += `
                <div class="container-fluid" onclick="location.href='/products/view/${products[i].id}'" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                <div class="row">
                 <div class="col-md-3" style=" padding: 0">
                   <img src="img/${products[i].images[0].imagePath}" alt="image" 
                   style="width: 100%; height: 150px; margin: 0" />
                  </div>
               <div class="col-md-9">
           <h3>${products[i].title}</h3>
           <h4>${products[i].price}원</h4>
           <h6>${timeAgo}</h6>
           <span>조회: ${products[i].viewCount}회</span>
           <br>
           <span style="float: right;">🎯 ${products[i].dealCount} ❤ ${products[i].likes}</span>
       </div>
    </div>
    </div>
                `;
              }
              $('#bb').append(temp);

              if (products.length < res.data.totalProducts) {

                limit += products.length

                // limit += 10
                // offset += 10

                offset += products.length
              }
              
            })
            .catch(error => {
              if (productsLength === totalProducts) {
                alert('끝 페이지입니다.')
                window.removeEventListener('scroll', debouncedPageProduct);
              }
              else {
                alert('데이터를 불러오는 중 오류가 발생했습니다.');
              }
            });
        }
      };
      ///상품 페이지네이션 끝////////

      ///상품 검색////////
     
      ///상품검색 끝/////
    }
  })
  .catch((error) => {
    let temp = '';
    temp += `
                    <div class="container-fluid" onclick="alert('상품디테일 연결예정')" style="border-bottom: 3px dotted #5cd7f2; margin-top: 20px; padding-bottom: 10px">
                     <div class="row">
                      <div class="col-md-3" style=" padding: 0">
                        <img src="https://news.koreadaily.com/data/photo/2023/03/10/202303040941779270_6404a4b927e18.jpg" alt="image" 
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
      </div>
      
      `;
    document.getElementById('bb').innerHTML = temp;
  });
  



