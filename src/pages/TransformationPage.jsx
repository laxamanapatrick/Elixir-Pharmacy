import React, { useState, useEffect, useContext } from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';
import apiClient from '../services/apiClient';

const TransformationPage = ({ notification, fetchNotification }) => {
    const { selectedMenu } = useContext(Context)

    useEffect(() => {
        fetchNotification()
    }, [])

    return <Flex flexDirection='column' width='full'>
        <Flex bgColor='secondary'>
            {
                selectedMenu && (<Navbar menus={selectedMenu} notification={notification} />)
            }
        </Flex>
        <Flex>
            <Outlet />
        </Flex>
    </Flex>;
};

export default TransformationPage;
