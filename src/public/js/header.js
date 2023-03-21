
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
  
  
  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      // 엔터 키를 누르면 검색 함수 호출
      productSearch();
    }
  }
  
  // 상품 검색
  function productSearch() {
    const search = document.getElementById('search').value;
    console.log(search);
  
    axios
      .get(`http://localhost:3000/orders/productSearch?search=${search}`)
      .then((res) => {
       
        let data = res.data.data;
        let totalProducts = res.data.totalProducts
        let temp = '';
        for (let i = 0; i < data.length; i++) {
          const timeAgo = getTimeAgo(data[i].createdAt);
  
          // 검색어 배경색 적용
          const title = data[i].title.replace(
            new RegExp(`(${search})`, 'gi'),
            '<span style="background-color: yellow">$1</span>',
          );
          temp += `
            <div class="col-md-6 col-lg-3">
                          <div class="card">
                              <img class="img-fluid" 
                                src="/img/${data[i].images[0].imagePath}"
                                style="min-height: 250px; max-height: 250px"
                                 onclick="window.location='/productss/asdf/${data[i].id}'" alt="">
                              <div class="card-body">
                                  <h5 class="card-title">${title}</h5>
                                  <h6 class="card-title">${data[i].price} 원</h6>
                                  <p class="card-text">
                                      <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                        <small class="text-muted">${data[i].likes}　</small>
                                      <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                        <small class="text-muted">${data[i].viewCount}　</small>
                                      <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="6%">
                                       <small class="text-muted">${timeAgo}</small>
                                  </p>
                              </div>
                          </div>
                      </div>
            
            <input type="hidden" value="${data.length}" id="productsSearchLength">
            <input type="hidden" value="${totalProducts}" id="totalProductsSearch">
    `;
        }
        document.getElementById('product-list').innerHTML = temp;
  
        //검색 페이지네이션
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
  
        let limit = Number(document.getElementById('productsSearchLength').value)
        let offset = Number(document.getElementById('productsSearchLength').value)
        let TotalProducts = Number(document.getElementById('totalProductsSearch').value)
        
        if(window.location.href === 'localhost:3000/order/dealcheck' || 'localhost:3000/order/mydeal'){
            const debouncedPageSearchProduct = debounce(pageSearchProduct, 50)
            window.addEventListener('scroll', debouncedPageSearchProduct);
        }

        else{ 
        window.removeEventListener('scroll', debouncedPageProduct);
        const debouncedPageSearchProduct = debounce(pageSearchProduct, 50)
        window.addEventListener('scroll', debouncedPageSearchProduct);}
            
        
       
  
    function pageSearchProduct() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
  
        const totalProducts = TotalProducts
        const productsLength = limit
        console.log(33, productsLength)
        console.log(44, totalProducts)
  
        axios.get(`http://localhost:3000/orders/productSearch?search=${search}&limit=${limit}&offset=${offset}`)
          .then(res => {
            
            const products = res.data.data;
            console.log(55, products)
            let temp = '';
  
            for (let i = 0; i < products.length; i++) {
              const timeAgo = getTimeAgo(products[i].updatedAt);
              let productP = products[i].price;
          const productPrice = productP
  
              const title = products[i].title.replace(
                new RegExp(`(${search})`, 'gi'),
                '<span style="background-color: yellow">$1</span>',
              );
  
              temp += `
              <div class="col-md-6 col-lg-3">
                          <div class="card">
                              <img class="img-fluid" 
                                src="/img/${products[i].images[0].imagePath}"
                                style="min-height: 250px; max-height: 250px"
                                 onclick="window.location='/productss/asdf/${products[i].id}'" alt="">
                              <div class="card-body">
                                  <h5 class="card-title">${title}</h5>
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
  
              offset += products.length
            }
          })
          .catch(error => {
            if (productsLength === totalProducts) {
              alert('끝 페이지입니다.')
              window.removeEventListener('scroll', debouncedPageSearchProduct);
            }
            else {
              alert('데이터를 불러오는 중 오류가 발생했습니다.');
            }
          });
      }
    };
  
      })
      .catch((error) => {
        console.log(error);
        // window.location.reload();
      });
  }