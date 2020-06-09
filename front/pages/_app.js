import React from 'react';
import PropTypes from 'prop-types';//부모로부터 물려받은 props를 제대로 받았는지 확인하는 것
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga'; //next용 redux saga임 서버사이드렌더링 할때 app.js에서 사전작업 필요 맨 밑export에도 감싸줘야함
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';
import Helmet from 'react-helmet';
import App, { Container } from 'next/app';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
//레이아웃을 위한 파일을 next가 지정 pages폴더 안에 _app.js임 pages 폴더 안 _app.js가 아닌 파일들은
//_app.js를 부모 컴포넌트로 사용

// class NodeBird extends App {
//   static getInitialProps(context) {
//
//   }
//   render() {
//
//   }
// }

const NodeBird = ({ Component, store, pageProps }) => {//app.js가 props로 Component라고 받음 
  //_app.js가 props로 Component라고 받는다 next가 다른 파일들을 Component로 넣어준다 
  //Component는 next에서 넣어주는 props인데 자식 컴포넌트랑 합쳐저서 보여짐
  return ( //여기가 app.js기 때문에 여기에 넣는 helmet은 모든 페이지에 공통으로 들어가는 head태그를 넣는 것임
    <Container>
      <Provider store={store}>
        <Helmet
          title="NodeBird"
          htmlAttributes={{ lang: 'ko' }}/*이 페이지는 한국어 페이지 */
          meta={[{
            charset: 'UTF-8',
          }, {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          }, {
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',//인터넷 딕스플로러나 엣지
          }, {
            name: 'description', content: '제로초의 NodeBird SNS',
          }, {
            name: 'og:title', content: 'NodeBird',
          }, {
            name: 'og:description', content: '제로초의 NodeBird SNS',
          }, {
            property: 'og:type', content: 'website',
          }]}
          link={[{
            rel: 'shortcut icon', href: '/favicon.ico',
          }, {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
          }, {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
          }, {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
          }]}
        />
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </Provider>
    </Container>
  );// Component는 app.js의 props인 children으로 감
};

NodeBird.propTypes = {//함수 컴포넌트 이름에다 .propTypes라고 붙임
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};
//getInitialProps가 서버일때도 실행되고 프런트일때도 실행되서 분기처리 해야함
NodeBird.getInitialProps = async (context) => {//getInitialProps는 pages 안에서만 쓸 수 있음
  const { ctx, Component } = context;
  let pageProps = {};
  const state = ctx.store.getState();//store의 getState를 이용해서 state를 가져온다
  const cookie = ctx.isServer ? ctx.req.headers.cookie : ''; /*ctx에 req,res는 서버환경일 때만 들어있음 ctx가 서버일때만 쿠키 가져옴
  만약 클라이언트면 req가 undefined라서 에러남 ctx.isServer가 없을 때는 클라이언트이므로 그냥 없는 겂으로*/
  /*
    클라이언트 환경일때는 브라우저가 쿠키 넣어주고 서버 환경일때는 쿠키를 직접 넣어줘야함
    */
  axios.defaults.headers.Cookie = ''; //axios에다 쿠키데이터를 직접 심어줄 수 있도록 일단 정의 바로 밑 if절에서 cookie저장할것임
  if (ctx.isServer && cookie) { //서버 환경이고 쿠키도 있으면//ctx안에 isServer가 있음
    axios.defaults.headers.Cookie = cookie;//axios에다 cookie를 기본으로 심어주게 할 수 있음
  }
  if (!state.user.me) { //내가 없으면 불러옴//원래 applayout component에 있었지만 getInitialprops는 페이지에만 쓸 수 있어서 app.js로 옮김
    ctx.store.dispatch({ //호출 순서 내정보를 먼저 가져오고(load user request) Component를 실행한다(Component.getInitialProps(ctx))
      type: LOAD_USER_REQUEST,//user 정보도 서버 사이드 렌더링
    });
  }
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx) || {}; // []는 pageprops 기본값 넣어준 것(isReqiored가 있어서 필수임)
    //ex? Component가 index컴포넌트라서 ctx넣어준게 index에서 getInitialprops에 cotext가 됨
  }
  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];/*
   const middlewares = [sagaMiddleware, (store) => (next) =>(action) => { //커스텀 미들웨어는 삼단함수라고 함 action에러가 없는지 찍는 미들웨어를 즉석으로 만들었음
     console.log(action);
     next(action);
   }];
  */
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : compose(
      applyMiddleware(...middlewares),
      !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga); //sagaTask에 sagaMiddleware.run한 걸 넣어줘야 함 withReduxSaga가 이 부분이 있어야 넥스트에서 리덕스사가로 서버사이드렌더링 가능
  return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBird)); //withRduxSaga로 감싼다(서버 사이드 렌더링 사전작업)
