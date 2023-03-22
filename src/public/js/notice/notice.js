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
                    <tr data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getNoticeById(${notices[i].id})" style="cursor: pointer">
                        <td>${notices[i].title}</td>
                        <td>
                            <span >${timeAgo}</span>
                        </td>
                    </tr>   
                    
                    <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" id="modalNotice">
      <div class="modal-header" >
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
      </div>
      <div class="modal-body" >
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>            
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
  pagination += `<button class="page-link" data-page="${i}" >${i}</button>`;
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
        let notices = res.data.notices;
        let temp = '';
        for (let i = 0; i < notices.length; i++) {
          const timeAgo = getTimeAgo(notices[i].createdAt);
          temp += `
            <tr data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getNoticeById(${notices[i].id})" style="cursor: pointer">
              <td>${notices[i].title}</td>
              <td>
                <span >${timeAgo}</span>
              </td>
            </tr>
            
            <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" id="modalNotice" > 
      <div class="modal-header" >
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
      </div>
      <div class="modal-body" >
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
        }
        document.getElementById('notice-box').innerHTML = temp;
        currentPage = page; // update current page
        updatePagination(); // update pagination buttons
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          alert('로그인 후 사용이 가능합니다.');
          window.location.href = '/';
        } else if (error.response.status === 404) {
          let temp = '';
          temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
          document.getElementById('product-list').innerHTML = temp;
        }
      });
  });
}



function updatePagination() {
  let pagination = `<div class="pagination" id="pagination-box">`
    // <button class="page prev-btn" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;

  const startPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
  const endPage = Math.min(totalPages, startPage + buttonsToShow - 1);
 
if (currentPage > 3){
    pagination += `<button class="page-link" data-page="1">First</button>`;
  }

  if ( currentPage > 3) {
    pagination += `<button class="page-link dots" disabled>...</button>`;
  }
 
  

  for (let i = startPage; i <= endPage; i++) {
    pagination += `<button class="page-link" data-page="${i}" >${i}</button>`;
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
        let notices = res.data.notices;
        let temp = '';
        for (let i = 0; i < notices.length; i++) {
          const timeAgo = getTimeAgo(notices[i].createdAt);
          temp += `
            <tr data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getNoticeById(${notices[i].id})" style="cursor: pointer">
              <td>${notices[i].title}</td>
              <td>
                <span >${timeAgo}</span>
              </td>
            </tr>
            
            <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" id="modalNotice" > 
      <div class="modal-header" >
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
      </div>
      <div class="modal-body" >
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
        }
        document.getElementById('notice-box').innerHTML = temp;
        currentPage = page; // update current page
        updatePagination(); // update pagination buttons
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          alert('로그인 후 사용이 가능합니다.');
          window.location.href = '/';
        } else if (error.response.status === 404) {
          let temp = '';
          temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
          document.getElementById('product-list').innerHTML = temp;
        }
      });
  });
}

    }
//update pagination  function 끝// 


  }})
  
  .catch((error) => {
    console.log(error);
    if (error.response.status === 401) {
      alert('로그인 후 사용이 가능합니다.');
      window.location.href = '/';
    } else if (error.response.status === 404) {
      let temp = '';
      temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
      document.getElementById('product-list').innerHTML = temp;
    }
  });

  function getNoticeById (noticeId) {
    axios
                      .get(`http://localhost:3000/notices/${noticeId}`)
                      .then((res) => {
                        let notice = res.data.notice
                        console.log(res)
                        let temp = '';
                        let body = ''
        // const timeAgo = getTimeAgo(notice.createdAt);
        temp += `
        <div class="modal-header" >
        <h5 class="modal-title" id="exampleModalLabel">${notice.title}</h5>
      </div>
      <div class="modal-body" >
        <h4>${notice.description}<h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
        `
       
        document.getElementById('modalNotice').innerHTML = temp;
                          })
                      .catch((error) => {
                          // 예외처리 - 로그인안하고 들어올때 or 로그인 쿠키가 없을 때
                          console.log(error)
                          if (error.response.status === 401) {
                            alert('로그인 후 사용이 가능합니다.');
                            window.location.href = '/';
                          } else if (error.response.status === 404) {
                            let temp = '';
                            temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
                            document.getElementById('product-list').innerHTML = temp;
                          }
                        })
  
  }