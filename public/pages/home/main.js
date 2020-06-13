import { signOut, posts, loadingPost, saveEditPost, deletePost, editLikes, editComments } from "./data.js";

export const feed = () => {
  const feedTemplate = document.createElement('div');
  feedTemplate.classList.add('page-feed');
  feedTemplate.classList.add('pages');
  window.location.href = '#feed';
  feedTemplate.innerHTML = `
    <header class="header">
    <button class="btn-icon" id="openMenu"><i class="fas fa-bars icon menu"></i></button>
    <nav class="nav-main">
      <ul>
        <li>Perfil</li>
        <li id="signOut">Sair</li>
      </ul>
    </nav>
    <img src="./assets/nome-logo-feed.png">
  </header>
    <main class="main-feed">
      <section class="user-profile">
        <figure id="user-img"></figure>
        <span id="userName">${firebase.auth().currentUser.displayName}</span>
        <span id="bio"></span>
      </section>
      <div class="container">
        <section class="feed-write-post">
          <form class="form-feed">
            <textarea id="post-field" class="post-field" placeholder="O que deseja compartilhar?"></textarea>
            <div class="post-field-options">
              <form>
                <div id="form-privacy-options">
                  <label for="option-public"> 
                    <i class="fas fa-unlock icon privacity-icon"></i>
                    <input type="radio" name="privacy" id="option-public" class="btn-icon privacy-options" value="public" checked>
                  </label>
                  <label for="option-private">
                    <i class="fas fa-lock icon"></i>
                    <input type="radio" name="privacy" id="option-private" class="btn-icon privacy-options" value="private">
                  </label>
                </div>
              </form>
              <button id="share-post" class="btn">Postar</button>
            </div>
          </form>
        </section>
        <article class="feed-posts-container" id="posts-container"></article>
      </div>
    </main>
  `

  const menu = feedTemplate.querySelector('.nav-main');
  const mainToClose = feedTemplate.querySelector('.main-feed');

  feedTemplate.querySelector('#openMenu').addEventListener('click', () => {
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
      mainToClose.addEventListener('click', closeNav, true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      menu.style.display = 'block';
    } else {
      closeNav();
    }
  });

  const closeNav = () => {
    menu.style.display = 'none';
  }

  loadingPost()
    .then((arrayPosts) => {
      feedTemplate.querySelector('#posts-container').innerHTML = "";
      arrayPosts.forEach((doc) => {
        createPosts(doc)
      })
    })

  const createPosts = (doc, prepend) => {
    const post = doc.data();
    const postsContainer = feedTemplate.querySelector("#posts-container");
    const postsOnFeed = document.createElement("section");
    const buttonsWrap = document.createElement('div');
    buttonsWrap.classList.add('posted-box-options', 'box');
    postsOnFeed.classList.add("div-posts");
    postsOnFeed.innerHTML = ` 
      <div class='posted-box-by box'>
        <span class='name-user-published'>Publicado por ${post.name} em ${post.timestamps}</span>
      </div>
      <div class='posted-box-text box'>
        <p class='content-post'>${post.post}</p>
      </div>
    `
    postsContainer.appendChild(postsOnFeed);  


    if (post.userUid === firebase.auth().currentUser.uid) {
      buttonsWrap.innerHTML = `
      <div class="div-edit">
        <button class="btn-icon editBtn"><i class="fas fa-edit icon" aria-hidden="true"></i></button>
        <button class="i-none btn-icon edit-icon saveBtn"><i class="far fa-save icon" aria-hidden="true"></i></button>
        <select class="i-none edit-icon" id="select-privacy">
          <option value="public">Público</option>
          <option value="private">Privado</option>
        </select>
      </div>
      <button class="btn-icon deleteBtn"><i class="fas fa-trash-alt icon" aria-hidden="true"></i></button>
      `
      postsOnFeed.appendChild(buttonsWrap);  

      const editBtn = feedTemplate.querySelector('.editBtn');
      editBtn.setAttribute('data', 'edit');
      const saveBtn = feedTemplate.querySelector('.saveBtn');
      const deleteBtn = feedTemplate.querySelector('.deleteBtn');
      const selectPrivacy = feedTemplate.querySelector('.deleteBtn');
      const msgPost = feedTemplate.querySelector('.posted-box-text');
      msgPost.setAttribute('disabled', 'disabled');

      const editBtnFunctions = (event) => {
        const id = event.currentTarget.dataSet.id;
        document.querySelector(`.editBtn[id='${id}']`);
        saveBtn.classList.remove('i-none');
        selectPrivacy.classList.remove('i-none');
        msgPost.removeAttribute('disabled');
      }

      const saveBtnOptions = () => {
        saveBtn.classList.add('i-none');
        selectPrivacy.classList.add('i-none');

        const optionPrivacy = feedTemplate.querySelector('#select-privacy')
        const privacyValue = () => {
          return feedTemplate.querySelector('#select-privacy').value;
        }
        optionPrivacy.addEventListener('change', privacyValue);

        const changePostPrivacy = privacyValue();
        saveEditPost(msgPost.value, doc.id, changePostPrivacy);
      }

      const deletePostBtn = () => {
        const dataId = doc.id;
        feedTemplate.querySelector(`[data-postid=${dataId}]`).remove();
        deletePost(dataId);
      }

      editBtn.addEventListener('click', editBtnFunctions);
      saveBtn.addEventListener('click', saveBtnOptions);
      deleteBtn.addEventListener('click', deletePostBtn);

    } else {
      buttonsWrap.innerHTML = `
      <button class='btn-icon like'><i class='fas fa-heart icon'></i></button>
      <div class='numberLikes" data-number='number'>${doc.data().likes}</div>
      <button class='btn-icon commentBtn'><i class='fas fa-comments icon'></i></button>
      <div class='i-none divOptions'>
        <textarea></textarea>
        <button class='btn-icon sendPost'><i class='far fa-check-circle icon'></i></button>
        <button class='btn-icon'><i class='far fa-times-circle icon'></i></button>
      </div>
      `
      postsOnFeed.appendChild(buttonsWrap);
      const likeBtn = feedTemplate.querySelector('.like');
      const numberLikes = feedTemplate.querySelector('.numberLikes');
      const commentBtn = feedTemplate.querySelector('.commentBtn');
      const commentsOptions = feedTemplate.querySelector('.divOptions');
      const commentsText = feedTemplate.querySelector('.textComment');
      const commentsPostBtn = feedTemplate.querySelector('.sendPost');

      const addLikes = () => {
        const likeId = doc.id;
        let likes = (doc.data().likes) + 1;
        editLikes(likes, likeId);

        numberLikes.setAttribute('data', 'number')
        document.querySelector(`.numberLikes[data-number=${likeId}]`) + 1;
        numberLikes.innerHTML = doc.data().likes = + likes;
      }

      const addComment = () => {
        const textComment = commentsText.value;
        editComments(textComment, doc.id);
      }

      const showOptionsComments = () => {
        commentsOptions.classList.remove('i-none');
      }

      commentsPostBtn.addEventListener('click', addComment);
      likeBtn.addEventListener('click', addLikes);
      commentBtn.addEventListener('click', showOptionsComments);
    }

    if (!prepend) {
      postsContainer.appendChild(postsOnFeed);
    } else {
      postsContainer.prepend(postsOnFeed);
    }
  }

  feedTemplate.querySelector('#share-post').addEventListener('click', (e) => {
    e.preventDefault()
    const postText = feedTemplate.querySelector('#post-field').value;
    const privacyOptions = feedTemplate.querySelector('input[name="privacy"]:checked').value;

    posts(postText, privacyOptions)
      .then((doc) => {
        createPosts(doc, true)
      });

    feedTemplate.querySelector('#post-field').value = '';
  });

  feedTemplate.querySelector('#signOut').addEventListener('click', signOut);

  return feedTemplate;
};  