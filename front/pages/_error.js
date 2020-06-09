import React from 'react';
import PropTypes from 'prop-types';

const MyError = ({ statusCode }) => {//에러페이지 대체
  return (
    <div>
      <h1>{statusCode} 에러 발생</h1>
    </div>
  );
};

MyError.propTypes = {
  statusCode: PropTypes.number,
};

MyError.defaultProps = {
  statusCode: 400,
};

MyError.getInitialProps = async (context) => {//서버면 context.res가 있음, 에러에 필요한 정보들이 res나 err에 들어있음
  const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null;
  return { statusCode };
};

export default MyError;
