/*helmet을 서버사이드 렌더링 하기 위해 특수파일 _document.js를 만듦 */
/*head나 body를 직접 조작하기 위해서 _document.js 파일을 만듦 */
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { Main, NextScript } from 'next/document';//nextscripts는 next 서버구동에 필요한 스크립트들을 모아둔것
import { ServerStyleSheet } from 'styled-components';//styled-components 서버사이드렌더링 위해 ServerStyleSheet 불러옴

//document가 app의 상위라서 app를 실행해줘야함 
class MyDocument extends Document {//원래는 Document 자리에 Component _doucument파일에는 함수형 컴포넌트가 안되서 클래스형
  static getInitialProps(context) {//함수형이 아니라 클래스형으로 쓰면 getInitialProps가 static으로 들어감(이해안감)
    const sheet = new ServerStyleSheet();//ServerStyleSheet 사용하기 위한 과정
    //sheet.collectStyles로 감싼다
    const page = context.renderPage((App)/*App이 app.js임 */ => (props) => sheet.collectStyles(<App {...props} />));//context에서 renderPage를 해줘야지 app.js를 실행할수있음
    //renderPage로 내부페이지를 렌더링할 수 있게 ,app.js는 contaigner로 감싸줬음(연관이 있는지는 모름)
    const styleTags = sheet.getStyleElement();//ServerStyleSheet 사용하기 위한 과정 그냥 이렇게 사용하라고 공식문서에 있음 StyleTags를 밑줄에 넣줘야함
    return { ...page, helmet: Helmet.renderStatic(), styleTags };//Helmet.renerStatic()을 해주면 서버 사이드 렌더링이 됨
  }//return해준 것들은 this.props에 들어감

  render() {//htmlattributes는 html의 속성들을 헬멧엣 제공하는 것, bodyattributes는 body 속성들, ...helmet은 메타 태그,스크립트,스타일 등 나머지
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    const htmlAttrs = htmlAttributes.toComponent(); //기본적으로 객체형식인 것들을 리액트에서 쓸 수 있게 컴포넌트형으로 바꿈
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          {this.props.styleTags}
          {Object.values(helmet).map(el => el.toComponent())/*나머지는 head태그에 반복문으로 컴포넌트화해서 넣어줌 */}
        </head>
        <body {...bodyAttrs}>
          <Main /*main이 app.js가 될것임*//>
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.propTypes = {
  helmet: PropTypes.object.isRequired,
  styleTags: PropTypes.object.isRequired,
};

export default MyDocument;
