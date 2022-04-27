import React, { useState, useEffect, useContext } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';
import { NotificationContext } from '../context/NotificationContext'
import apiClient from '../services/apiClient';

const fetchNotificationApi = async () => {
    const res = await apiClient.get(`Receiving/GetNotification`)
    return res.data
}

const QcModulePage = () => {
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

    return (
            <Flex flexDirection='column' width='full'>
                <Flex bgColor='secondary'>
                    {
                        selectedMenu && (
                            <Navbar
                                menus={selectedMenu}
                                notification={notification}
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