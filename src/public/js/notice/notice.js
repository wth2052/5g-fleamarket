axios
  .get('http://localhost:3000/notices')
  .then((res) => {
    console.log(res)
    let notices = res.data.notices
    let totalNotice = res.data.totalNotice;
    if (notices !== 0) {
      let temp = '';
      for (let i = 0; i < notices.length; i++) {
        const timeAgo = getTimeAgo(notices[i].createdAt);
        temp += `
                    <tr>
                        <td>${notices[i].title}</td>
                        <td>
                            <span >${timeAgo}</span>
                        </td>
                    </tr>
                    
`;
      }
      document.getElementById('notice-box').innerHTML = temp;
     
      //페이지네이션

    //   let limit = Number(document.getElementById('noticesLength').value)
    //     let offset = Number(document.getElementById('noticesLength').value)
    //   let totalNotice = Number(document.getElementById('totalNotice').value)

    let limit = notices.length
    let offset = notices.length
      const totalPages = Math.ceil(totalNotice / limit); //10개에 1페이지씩
      let currentPage = Math.ceil(offset / limit);
     

      let pagination = `<div class="pagination" id="pagination-box">`;

    // const maxPagesToShow = 5;
    // let startPage = 1;
    // let endPage = totalPages;

    // if (totalPages > maxPagesToShow) {
    // const halfMaxPages = Math.floor(maxPagesToShow / 2);
    // if (currentPage > halfMaxPages) {
    //     startPage = currentPage - halfMaxPages;
    //     endPage = currentPage + halfMaxPages;
    // } else {
    //     endPage = maxPagesToShow;
    // }
    // if (endPage > totalPages) {
    //     endPage = totalPages;
    //     startPage = totalPages - maxPagesToShow + 1;
    // }
    // }

    // for (let i = startPage; i <= endPage; i++) {
    //     pagination += `<button class="page-link" data-page="${i}">${i}</button>`;
    //   }

    //   if (endPage < totalPages) {
    //     const nextPage = endPage + 1;
    //     pagination += `<button class="page-link" data-page="${nextPage}">Next</button>`;
    //   }

      for (let i = 1; i <= totalPages; i++) {
        pagination += `<button class="page-link" data-page="${i}">${i}</button>` ;
    }
      pagination += `</div>`;

      document.getElementById('pagination-box').innerHTML = pagination;



      // Event listeners for page links
      const pageLinks = document.getElementsByClassName('page-link');
      for (let i = 0; i < pageLinks.length; i++) {
        pageLinks[i].addEventListener('click', (event) => {
            event.preventDefault();
            //  Number(event.target.dataset.page) <-- 클릭된 페이지 넘버 불러오기
            const page = Number(event.target.dataset.page);
                offset = (page - 1) * limit;
          axios
            .get(`http://localhost:3000/notices?offset=${offset}&limit=${limit}`)
            .then((res) => {
              notices = res.data.notices;
              let temp = '';
              for (let i = 0; i < notices.length; i++) {
                const timeAgo = getTimeAgo(notices[i].createdAt);
                temp += `
                  <tr>
                    <td>${notices[i].title}</td>
                    <td>
                      <span >${timeAgo}</span>
                    </td>
                  </tr>`;
              }
              document.getElementById('notice-box').innerHTML = temp;
            })
            .catch((error) => {
              console.log(error);
            });

          

          
        });
      }
      
///

    }
  })
  .catch((error) => {
    console.log(error);
  });
