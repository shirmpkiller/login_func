import React, { useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import NicknameEditForm from '../containers/NicknameEditForm';

const Profile = () => {
  const dispatch = useDispatch();
 
  return (
    <div>
      <NicknameEditForm />
    </div>
  );
};


export default Profile;
