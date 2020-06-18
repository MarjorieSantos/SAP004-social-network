export const posts = (text, value) => {
  const Posts = {
    post: text,
    name: firebase.auth().currentUser.displayName,
    likes: 0,
    userUid: firebase.auth().currentUser.uid,
    timestamps: firebase.firestore.Timestamp.fromDate(new Date()).toDate().toLocaleString('pt-BR'),
    privacy: value,
    commentsCount: 0,
  }
  return firebase
    .firestore()
    .collection('posts')
    .add(Posts)
    .then((docRef) => docRef
    .get()
    .then((doc) => doc))
}

export const loadingPost = () => {
  return firebase
    .firestore()
    .collection('posts')
    .where('privacy', '==', 'public')
    .limit(10)
    .orderBy('timestamps', 'desc')
    .get()
    .then((querySnapshot) => {
      const arrayWithPosts = [];
      querySnapshot.forEach(doc => {
        arrayWithPosts.push(doc);
      });
      return arrayWithPosts;
    });
}

export const saveEditPost = (text, id, privacy) => {
  return firebase
    .firestore()
    .collection('posts')
    .doc(id)
    .update({
      post: text,
      privacy: privacy
    })
}

export const editLikes = (like, id) => {
  return firebase
    .firestore()
    .collection('posts')
    .doc(id)
    .update({
      "likes": like
    })
}

export const addComments = (id, comment) => {
  return firebase
    .firestore()
    .collection('posts')
    .doc(id)
    .update({
      commentCount: firebase.firestore.FieldValue.increment(1),
      comments: firebase.firestore.FieldValue.arrayUnion({
        name: firebase.auth().currentUser.displayName,
        userUid: firebase.auth().currentUser.uid,
        date: firebase.firestore.Timestamp.fromDate(new Date()).toDate().toLocaleString('pt-BR'),
        comment: comment,
        id: new Date().getTime()
      })
    })
}

export const saveEditComments = (text, id, commentTarget) => {
  return firebase
    .firestore()
    .collection('posts')
    .doc(id)
    .get()
    .then((doc) => {
       const mapComment = doc.data().comments.map((myComment) => {
        if(myComment.id === commentTarget.id){
          const newComment = {...commentTarget, comment: text}
          console.log(text)
          console.log(myComment.id, commentTarget.id)
          console.log(newComment)
          console.log(myComment)
          return newComment
        }
        return myComment
      })
      firebase
      .firestore()
      .collection('posts')
      .doc(id)
      .update({      
        comments: mapComment
      })
    })
    }

      export const deletePost = (id) => {
        return firebase
          .firestore()
          .collection('posts')
          .doc(id)
          .delete()
      }

      export const deleteOnlyComment = (id, comments) => {
        return firebase
          .firestore()
          .collection('posts')
          .doc(id)
          .update({
            commentsCount: firebase.firestore.FieldValue.increment(-1),
            comments: firebase.firestore.FieldValue.arrayRemove({
              ...comments
            })
          })
      }

      export const signOut = () => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            window.location.href = '#login';
          });
      }