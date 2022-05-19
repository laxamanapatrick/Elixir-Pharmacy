import React, { useState, useEffect, useContext } from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';
import apiClient from '../services/apiClient';

const fetchNotificationApi = async () => {
    const res = await apiClient.get(`Receiving/GetNotification`)
    return res.data
}

const TransformationPage = () => {
    const { selectedMenu } = useContext(Context)

    const [notification, setNotification] = useState([])

    const fetchNotification = () => {
        fetchNotificationApi().then(res => {
            setNotification(res)
        })
    }

    useEffect(() => {
        fetchNotification()

        return () => {
            setNotification([])
        }
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
