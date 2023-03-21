axios
  .get('http://localhost:3000/productss/view')
  .then((res) => {
    let data = res.data;
    let products = data.products;
    let totalProducts = data.totalProducts;
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < products.length; i++) {
        let productP = products[i].price;
        const productPrice = productP
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const timeAgo = getTimeAgo(products[i].pullUp);
        temp += `
                    <div class="col-md-6 col-lg-3">
                        <div class="card">
                            <img class="img-fluid" 
                              src="/img/${products[i].images[0].imagePath}"
                              style="min-height: 250px; max-height: 250px"
                               onclick="window.location='/productss/asdf/${products[i].id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${products[i].title}</h5>
                                <h6 class="card-title">${productPrice} 원</h6>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                      <small class="text-muted">${products[i].likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                      <small class="text-muted">${products[i].viewCount}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="6%">
                                     <small class="text-muted">${timeAgo}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" value="${products.length}" id="productsLength">
                    <input type="hidden" value="${totalProducts}" id="totalProducts">
`;
      }
      document.getElementById('product-list').innerHTML = temp;
      // 상품 페이지네이션//////////////////////////////////
      console.log('productslenght', products.length)
      console.log('total', totalProducts)
      function debounce(func, wait = 5, immediate = false) {
        let timeout;
        return function () {
          const context = this
          const args = arguments

          const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };

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
          console.log(33, productsLength)
          console.log(44, totalProducts)

          axios.get(`http://localhost:3000/productss/view?limit=${limit}&offset=${offset}`)
            .then(res => {
              const products = res.data.products;
              console.log(55, products)
              let temp = '';

              for (let i = 0; i < products.length; i++) {
                const timeAgo = getTimeAgo(products[i].updatedAt);
                let productP = products[i].price;
        const productPrice = productP
                temp += `
                <div class="col-md-6 col-lg-3">
                        <div class="card">
                            <img class="img-fluid" 
                              src="/img/${products[i].images[0].imagePath}"
                              style="min-height: 250px; max-height: 250px"
                               onclick="window.location='/productss/asdf/${products[i].id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${products[i].title}</h5>
                                <h6 class="card-title">${productPrice} 원</h6>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                      <small class="text-muted">${products[i].likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                      <small class="text-muted">${products[i].viewCount}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="6%">
                                     <small class="text-muted">${timeAgo}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
              }
              $('#product-list').append(temp);

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
    }
  })
  .catch((error) => {
    console.log(error);
  });

