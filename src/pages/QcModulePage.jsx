import React, { useContext, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';

const QcModulePage = ({ notification, fetchNotification }) => {
    const { selectedMenu } = useContext(Context)

    useEffect(() => {
        fetchNotification()
    }, [])

    return (
        <Flex flexDirection='column' width='full'>
            <Flex bgColor='secondary'>
                {
                    selectedMenu && (
                        <Navbar
                            menus={selectedMenu}
                            notification={notification}
                            fetchNotification={fetchNotification}
                        />
                    )
                }
            </Flex>
            <Flex>
                <Outlet />
            </Flex>
        </Flex>
    )
};

export default QcModulePage
