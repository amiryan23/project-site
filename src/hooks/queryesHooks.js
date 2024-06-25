import { useQuery,useMutation } from 'react-query';
import { fetchData,fetchUsers,fetchThisUser,fetchMusic} from './../api';
import {likePostFunction,dislikePostFunction,savePostToFavorite,addCommentPostFunction,deleteCommentPostFunction} from './../context/comment'
import {deletePostFunction,addPostFunction,AddStoryFunction} from './../context/posts'
import {followFunction,unfollowFunction,accpetRequestFunction,cancelRequestFunction,changeInfoUserFunction} from './../context/users'
import {addMusicFunction} from './../context/music'
import { useQueryClient } from 'react-query';


export const usePostsQuery = () => {
  const { data: arrayPosts, isLoading:postsisLoading, isError:postsisError } = useQuery('arrayPosts', fetchData, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    retry:false,

  });

  return { arrayPosts, postsisLoading, postsisError };
};
    
    
export const useUsersQuery = () => {
 const { data: users, isLoading:usersisLoading, isError:usersisError } = useQuery('users', fetchUsers, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    retry:false,

  });

  return { users, usersisLoading, usersisError };
};

export const useThisUserQuerry = () => {
  const {data:thisUser,isLoading:thisUseridLoading,isError:thisUserisError} = useQuery('thisUser',fetchThisUser,{
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    retry:false,

  });

  return { thisUser, thisUseridLoading, thisUserisError };
}

export const useMusicsQuery = () => {
  const {data:musicsArray,isLoading:musicsisLoading,isError:musicsisError} = useQuery('musicsArray',fetchMusic,{
        refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 120000,
    retry:false,

  });

  return {musicsArray,musicsisLoading,musicsisError}
}



export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  const likePostMutation = useMutation(
    async ({ postId, userId  }) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if (arrayPosts) {
        return likePostFunction(postId, userId , arrayPosts, queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
     
        queryClient.invalidateQueries('arrayPosts');
      },
    }
  );

  return likePostMutation;

};


  export const useDislikePostMutation = () => {
  const queryClient = useQueryClient();

  const dislikePostMutation = useMutation(
    async ({ postId, userId }) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if (arrayPosts) {
        return dislikePostFunction(postId, userId, arrayPosts, queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
        
        queryClient.invalidateQueries('arrayPosts');
      },
    }
  );

  return dislikePostMutation;
};

export const useSavePostToFavorite = () => {
  const queryClient = useQueryClient();

  const savePostToFavoriteMutation = useMutation(
    async ({postId,userId}) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if(arrayPosts) {
        return savePostToFavorite(postId,userId,arrayPosts,queryClient);

      } else {
        return Promise.reject("Массив поста не определен")
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('arrayPosts');
      },
    }
    );

  return savePostToFavoriteMutation
}


  export const useAddCommentToPostMutation = () => {
  const queryClient = useQueryClient();

  const addCommentPostMutation = useMutation(
    async ({ postId, userId , thisUser , commentText, replyComment,file }) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if (arrayPosts) {
        return addCommentPostFunction(postId, userId, thisUser , commentText   , replyComment , file ,arrayPosts, queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
       
        queryClient.invalidateQueries('arrayPosts');
      },
    }
  );

  return addCommentPostMutation;
};


  export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation(
    async ({ idToDelete }) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if (arrayPosts) {
        return deletePostFunction(idToDelete , arrayPosts, queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
        
        queryClient.invalidateQueries('arrayPosts');
      },
    }
  );

  return deletePostMutation;
};



  export const useAddPostMutation = () => {
  const queryClient = useQueryClient();

  const addPostMutation= useMutation(
    async ({ thisUser,postText,fileUrl,imageRef,forwardPost,tagged,trackId}) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if (arrayPosts) {
        return addPostFunction(thisUser,postText,fileUrl,imageRef,forwardPost,tagged,trackId,arrayPosts,queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
       
        queryClient.invalidateQueries('arrayPosts');
      },
    }
  );

  return addPostMutation;
};


 export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  const followMutation= useMutation(
    async ({ user }) => {
      const users = queryClient.getQueryData('users');
      const thisUser = queryClient.getQueryData('thisUser')

      if (users && thisUser) {
        return followFunction(thisUser, user , queryClient);
      } else {
        return Promise.reject("Массив  не определен.");
      }
    },
    {
      onSuccess: () => {
        
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('thisUser');
      },
    }
  );

  return followMutation;
};


 export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  const unfollowMutation= useMutation(
    async ({ user }) => {
      const usersArray = queryClient.getQueryData('users');
      const thisUser = queryClient.getQueryData('thisUser')

      if (usersArray && thisUser) {
        return unfollowFunction(thisUser, user, usersArray , queryClient);
      } else {
        return Promise.reject("Массив  не определен.");
      }
    },
    {
      onSuccess: () => {
        
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('thisUser');
      },
    }
  );

  return unfollowMutation;
};



 export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  const acceptRequestMutation= useMutation(
    async ({ user }) => {
      const usersArray = queryClient.getQueryData('users');
      const thisUser = queryClient.getQueryData('thisUser')

      if (usersArray && thisUser) {
        return accpetRequestFunction(thisUser, user, usersArray , queryClient);
      } else {
        return Promise.reject("Массив  не определен.");
      }
    },
    {
      onSuccess: () => {
       
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('thisUser');
      },
    }
  );

  return acceptRequestMutation;
};


// 
//  export const useChangeInfoUser = () => {
//   const queryClient = useQueryClient();
// 
//   const changeInfoUserMutation = useMutation(
//     async ({ username,age,country,city,fileUrl,imageRef,description,privateProfile }) => {
//       
//       const thisUser = queryClient.getQueryData('thisUser')
// 
//       if ( thisUser ) {
//         return changeInfoUserFunction(thisUser,username,age,country,city,fileUrl,imageRef,description,privateProfile,queryClient);
//       } else {
//         return Promise.reject("Массив  не определен.");
//       }
//     },
//     {
//       onSuccess: () => {
//         // Опционально: перезагрузить данные после успешного обновления
//         
//         queryClient.invalidateQueries('thisUser');
//       },
//     }
//   );
// 
//   return changeInfoUserMutation;
// };


 export const useCancelRequest = () => {
  const queryClient = useQueryClient();

  const cancelRequestmutation= useMutation(
    async ({ user }) => {
      
      const thisUser = queryClient.getQueryData('thisUser')

      if ( thisUser) {
        return cancelRequestFunction(thisUser, user , queryClient);
      } else {
        return Promise.reject("Массив  не определен.");
      }
    },
    {
      onSuccess: () => {
       
        
        queryClient.invalidateQueries('thisUser');
      },
    }
  );

  return cancelRequestmutation;
};


export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation(
        async ({ postId,commentIdToDelete }) => {
      const arrayPosts = queryClient.getQueryData('arrayPosts');

      if (arrayPosts) {
        return deleteCommentPostFunction(postId,arrayPosts,commentIdToDelete,queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
        
        queryClient.invalidateQueries('arrayPosts');
      },
    }
    )
  return deleteCommentMutation;
}


// export const useNotification = () => {
//   const queryClient = useQueryClient();
// 
//   const notificationMutation = useMutation(
//     async({thisUser,user,notificText}) => {
//      const usersArray = queryClient.getQueryData('users');
//      if(usersArray) {
//       return notificationFunction(thisUser,user,notificText,queryClient)
//      } else{
//       return Promise.reject("Массив постов не определен.");
//      }
//     },
//     {
//       onSuccess: () => {
//         
//         queryClient.invalidateQueries('users');
//       },
//     }
//     )
//   return notificationMutation
// }


export const useAddMusic = () => {
  const queryClient = useQueryClient();

    const addMusicMutation= useMutation(
    async ({ thisUser,trackName,imageRef,trackRef}) => {
      const musicsArray = queryClient.getQueryData('musicsArray');

      if (musicsArray) {
        return addMusicFunction(thisUser,trackName,imageRef,trackRef,musicsArray,queryClient);
      } else {
        return Promise.reject("Массив постов не определен.");
      }
    },
    {
      onSuccess: () => {
       
        queryClient.invalidateQueries('musicsArray');
      },
    }
  );

      return addMusicMutation;
};


export const useAddStory = () => {
  const queryClient = useQueryClient();

  const addStoryMutation = useMutation(
    async ({thisUser,fileUrl}) => {
      const usersArray = queryClient.getQueryData('users');

      if(usersArray) {
        return AddStoryFunction(thisUser,fileUrl,queryClient)
      } else {
        return Promise.reject("Error")
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      },
    }

    );

  return addStoryMutation
}