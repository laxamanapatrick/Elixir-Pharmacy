import { Flex, Box, Image, Text, HStack, Badge } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../context/Context';
import apiClient from '../services/apiClient';
import { decodeUser } from '../services/decode-user';
import { HiOutlineArrowCircleRight } from 'react-icons/hi'
import { MdOutlineNotificationsActive } from 'react-icons/md'

const currentUser = decodeUser()

const fetchTagModuleApi = async () => {
    const currentSelectedRole = currentUser?.role
    const res = await apiClient.get(`Role/GetRoleModuleWithId/${currentSelectedRole}`)
    return res.data
}

const SidebarHeader = () => {
    return <Flex bgColor='primary' h='50px'></Flex>
}

const SidebarFooter = () => {
    return <Flex justifyContent='center' alignItems='center' flexDirection='column' pb='3'>
        <Image src='/images/logo.png'></Image>
        <Text color='white' fontSize='xs' textAlign='center'>© 2022, Elixir Powered by Process Automation (MIS)</Text>
    </Flex>
}

const Sidebar = ({ notification, fetchNotification }) => {
    const { pathname } = useLocation()
    const [tagModules, setTagModules] = useState([])
    const { setSelectedMenu } = useContext(Context)

    const fetchTagged = () => {
        fetchTagModuleApi(tagModules).then(res => {

            const unique = []
            const map = new Map();
            for (const item of res) {
                if (!map.has(item.mainMenuId)) {
                    map.set(item.mainMenuId, true);
                    const submenu = res.filter(s => s.mainMenuId === item.mainMenuId && s.subMenu !== item.mainMenu)
                    unique.push({
                        mainMenuId: item.mainMenuId,
                        mainMenu: item.mainMenu,
                        path: item.menuPath,
                        subMenu: submenu.map(sub => {
                            return {
                                title: sub.subMenu,
                                path: sub.moduleName
                            }
                        })
                    })
                }
            }
            setTagModules(unique)
        })
    }

    useEffect(() => {
        fetchTagged()

        return () => {
            setTagModules([])
        }
    }, []);

    const selectedMenuHandler = (data) => {
        setSelectedMenu(data)
    }

    const sideBars = [
        {
            title: 'MO Approval',
            notifcation: notification?.forApprovalMoveOrder?.forapprovallistcount,
        },
        {
            title: 'Ordering',
            notifcation: notification?.orderingApproval?.orderingapprovalcount,
        },
        {
            title: 'Inventory',
            notifcation: notification?.moveOrderList?.moveordercount,
        }
    ]

    return (
        <Flex
            h='100vh'
            flexDirection='column' justifyContent='space-between' bgColor='secondary' width='15rem' borderColor='primary' borderRight='1px'
        >
            <Flex flexDirection="column">
                <SidebarHeader />
                {tagModules?.map((modName) => (
                    <Link to={modName.path} key={modName.mainMenuId}>
                        <Box
                            onClick={() => selectedMenuHandler(modName)}
                            bgColor={pathname.includes(modName.path) ? 'accent' : 'secondary'} p={2} borderBottom='1px' borderColor='primary' cursor='pointer'
                            _hover={{ bgGradient: "linear(to-l, #003366, accent)" }}
                            bgGradient={pathname.includes(modName.path) ? "linear(to-l, accent, #003366)" : 'secondary'}
                        >
                            <HStack justifyContent='space-between'>
                                <Text
                                    color='white'
                                >
                                    {modName.mainMenu}
                                </Text>
                                {sideBars.map((side, i) => (
                                    !pathname.includes(modName.path) ?
                                        modName.mainMenu === side.title &&
                                        <Badge key={i} background='none'>
                                            {side.notifcation === 0 ? '' : <MdOutlineNotificationsActive
                                                fontSize='18px'
                                                // color='#87CEAA' 
                                                color='#f56565'
                                            />}
                                        </Badge>
                                        :
                                        ''
                                )
                                )}
                                <HiOutlineArrowCircleRight hidden={!pathname.includes(modName.path) ? '6px 3px 3px' : ''} color='white' />
                            </HStack>
                        </Box>
                    </Link>
                ))}

            </Flex>
            <SidebarFooter />
        </Flex>
    )
}

export default Sidebar;
