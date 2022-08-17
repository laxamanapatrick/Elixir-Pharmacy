import React, { useContext } from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';

const MoveOrderApproval = ({ notification, fetchNotification }) => {
    const { selectedMenu } = useContext(Context)

    return <Flex flexDirection='column' width='full'>
        <Flex bgColor='secondary'>
            {
                selectedMenu && (<Navbar menus={selectedMenu}
                    notification={notification}
                    fetchNotification={fetchNotification}
                />)
            }
        </Flex>
        <Flex>
            <Outlet />
        </Flex>
    </Flex>;
};

export default MoveOrderApproval;
