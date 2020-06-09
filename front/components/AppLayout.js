import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row } from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';

const AppLayout = ({ children }) => { //children은 props임
  const { me } = useSelector(state => state.user);

  return (/*
    a태그의 href는 link가 가져간다
  */
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"/*key가 일종의 반복문 역할을 해서 넣는 것같음 */><Link href="/"><a>Home</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search
            enterButton
            style={{ verticalAlign: 'middle' }} ///*react에서 style 적용시 객체형식으로/원래 vertical-align인데 자바스크립트에서는 -를 못써서 대문자 A로 바꿔 붙여씀*/
          />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me//로그인한 상황이면 userprofile을 보여주고 아니면 loginform
            ? <UserProfile />
            : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,//렌더링 되는 모든 것은 node
};

export default AppLayout;
