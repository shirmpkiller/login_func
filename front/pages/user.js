import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../containers/PostCard';

const User = () => {
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);

  return (
    <div>
      {userInfo
        ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />
          </Card>
        )
        : null}
      {mainPosts.map(c => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

User.getInitialProps = async (context) => { //getInitialProps가 서버쪽에서도 실행되고 프런트에서도 실행됨
   /*async함수라 하는데 이유 없음 context는 app.js에서 넣어주는 context.ctx //app.js에서 awiat.Component.getInitialProps(ctx)라고 돼
  있는데 여기서 Component가 index.js기 때문에 ctx넣어준게 여기서 context가 되는 것*/
  const id = parseInt(context.query.id, 10);//서버쪽에서는 처음으로 이 페이지를 불러올 때 실행됨//10왜 넣는지 설명안함
  console.log('user getInitialProps', id); //프론트에서는 next router로 페이지 넘나들때 프론트에서 실행됨
  context.store.dispatch({//context의 키중에 store(리덕스 스토어)가 있는데 store안에는 dispatch,getstate(리덕스 스테이트를 가져올수있는)등이 있다
    type: LOAD_USER_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });
  return { id };
};

export default User;
