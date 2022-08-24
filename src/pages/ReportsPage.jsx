import React, { useContext } from 'react';
import { Flex, Table, Tbody } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';

const ReportsPage = () => {
  const { selectedMenu } = useContext(Context)

  return <Flex flexDirection='column' width='full'>
      <Flex bgColor='secondary'>
          {
              selectedMenu && (<Navbar menus={selectedMenu} />)
          }
      </Flex>
      <Flex>
          <Outlet />
      </Flex>
  </Flex>;
};

export default ReportsPage