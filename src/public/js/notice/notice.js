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
                    <tr >
                        <td>${notices[i].title}</td>
                        <td>
                            <span >${timeAgo}</span>
                        </td>
                    </tr>     
                    
`;
      }
      document.getElementById('notice-box').innerHTML = temp;
     
      //페이지네이션

    let limit = notices.length
    let offset = notices.length
      const totalPages = Math.ceil(totalNotice / limit); //10개에 1페이지씩

    let currentPage = 1; // initialize current page to 1

const buttonsToShow = 5; // number of buttons to show at a time

let pagination = `<div class="pagination" id="pagination-box">`
  // <button class="page prev-btn" disabled>Prev</button>`;
  
for (let i = 1; i <= Math.min(totalPages, buttonsToShow); i++) {
  pagination += `<button class="page-link" data-page="${i}">${i}</button>`;
}

if (currentPage + Math.floor(buttonsToShow / 2) < totalPages) {
  pagination += `<button class="page-link dots" disabled>...</button>`;
}

if (currentPage + Math.floor(buttonsToShow / 2) < totalPages) {
  pagination += `<button class="page-link" data-page="${totalPages}">Last</button>`;
}

if (totalPages > buttonsToShow) {
  pagination += `<button class="page-link dots" disabled>${currentPage} out of ${totalPages}</button>`;
}

pagination += `</div>`;
document.getElementById('pagination-box').innerHTML = pagination;

const pageLinks = document.getElementsByClassName('page-link');


for (let i = 0; i < pageLinks.length; i++) {
  pageLinks[i].addEventListener('click', (event) => {
    event.preventDefault();
    const page = Number(event.target.dataset.page);
    if (currentPage !== page) {
      currentPage = page;
   
      updatePagination();
    }
  });
}



function updatePagination() {
  let pagination = `<div class="pagination" id="pagination-box">`
    // <button class="page prev-btn" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;

  const startPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
  const endPage = Math.min(totalPages, startPage + buttonsToShow - 1);
 
if (currentPage > 1){
    pagination += `<button class="page-link" data-page="1">First</button>`;
  }

  if ( currentPage > 1) {
    pagination += `<button class="page-link dots" disabled>...</button>`;
  }
 
  

  for (let i = startPage; i <= endPage; i++) {
    pagination += `<button class="page-link" data-page="${i}" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
  }

  if (currentPage + Math.floor(buttonsToShow / 2) < totalPages) {
    pagination += `<button class="page-link dots" disabled>...</button>`;
  }

  if (currentPage + Math.floor(buttonsToShow / 2) < totalPages) {
    pagination += `<button class="page-link" data-page="${totalPages}">Last</button>`;
  }
  

  pagination += `<button class="page-link dots" disabled>${currentPage} out of ${totalPages}</button>`;

  document.getElementById('pagination-box').innerHTML = pagination

// Event listeners for page links
const pageLinks = document.getElementsByClassName('page-link');
for (let i = 0; i < pageLinks.length; i++) {
  pageLinks[i].addEventListener('click', (event) => {
    event.preventDefault();
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
        currentPage = page; // update current page
        updatePagination(); // update pagination buttons
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

     

    //   let pagination = `<div class="pagination" id="pagination-box">`;
    //   for (let i = 1; i <= totalPages; i++) {
    //     pagination += `<button class="page-link" data-page="${i}">${i}</button>` ;
    // }
    //   pagination += `</div>`;
    //   document.getElementById('pagination-box').innerHTML = pagination;



    //   // Event listeners for page links
    //   const pageLinks = document.getElementsByClassName('page-link');
    //   for (let i = 0; i < pageLinks.length; i++) {
    //     pageLinks[i].addEventListener('click', (event) => {
    //         event.preventDefault();
    //         //  Number(event.target.dataset.page) <-- 클릭된 페이지 넘버 불러오기
    //         const page = Number(event.target.dataset.page);
    //             offset = (page - 1) * limit;
    //       axios
    //         .get(`http://localhost:3000/notices?offset=${offset}&limit=${limit}`)
    //         .then((res) => {
    //           notices = res.data.notices;
    //           let temp = '';
    //           for (let i = 0; i < notices.length; i++) {
    //             const timeAgo = getTimeAgo(notices[i].createdAt);
    //             temp += `
    //               <tr>
    //                 <td>${notices[i].title}</td>
    //                 <td>
    //                   <span >${timeAgo}</span>
    //                 </td>
    //               </tr>`;
    //           }
    //           document.getElementById('notice-box').innerHTML = temp;
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         });
    //     });
    //   }
      
///

    }
  }})
  
  .catch((error) => {
    console.log(error);
  });

