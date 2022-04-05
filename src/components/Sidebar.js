import { Flex, Box, Image, Text, Button } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../context/Context';
import apiClient from '../services/apiClient';
import { decodeUser } from '../services/decode-user';

const currentUser = decodeUser()

const fetchTagModuleApi = async () => {
    const currentSelectedRole = currentUser.role
    const res = await apiClient.get(`Role/GetRoleModuleWithId/${currentSelectedRole}`)
    return res.data
}

const SidebarHeader = () => {
    return <Flex bgColor='primary' h='50px'></Flex>
}

const SidebarFooter = () => {
    return <Flex justifyContent='center' alignItems='center' flexDirection='column' pb='3'>
        <Image src='/images/logo.png'></Image>
        <Text color='white' fontSize='xs'>© 2022, Elixir Powered by MIS</Text>
    </Flex>
}

const Sidebar = () => {
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

    return (
        <Flex flexDirection='column' justifyContent='space-between' bgColor='secondary' width='15rem' h='100vh' borderColor='primary' borderRight='1px'>
            <Flex flexDirection="column">
                <SidebarHeader />
                {tagModules?.map((modName) => (
                    <Link to={modName.path} key={modName.mainMenuId}>
                        <Box
                            onClick={() => selectedMenuHandler(modName)}
                            bgColor={pathname.includes(modName.path) ? 'accent' : 'secondary'} p={2} borderBottom='1px' borderColor='primary' cursor='pointer' _hover={{ bgColor: 'accent' }}>
                            <Text
                                color='white'
                            >
                                {modName.mainMenu}
                            </Text>
                        </Box>
                    </Link>
                ))}

            </Flex>
            <SidebarFooter />
        </Flex>
    )
}

export default Sidebar;
