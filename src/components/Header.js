import {
    Box,
    Flex,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text
} from '@chakra-ui/react';
import React from 'react';
import { FiMenu } from 'react-icons/fi'
import { FaUserCircle } from 'react-icons/fa'
import moment from 'moment';
import { decodeUser } from '../services/decode-user';
import { useNavigate } from 'react-router-dom';

export const Header = (props) => {
    const user = decodeUser()
    const navigate = useNavigate()
    const logout = () => {
        sessionStorage.removeItem('userData')
        navigate('/')
    }

    //Logout when user not present
    // useEffect(() => {
    //     if (!user?.userName) {
    //         navigate('/')
    //     }
    // }, [user])

    const { sideBarHandler } = props
    return <Flex bgColor='primary' h='54px' justifyContent='space-between' pl={2} pr={2} alignItems='center'>
        <HStack>
            <FiMenu color='#87CEAA' size='24px' cursor='pointer' onClick={sideBarHandler} />
            <Text color='white' fontWeight='normal' fontSize='sm'>Date: {moment().format('MMMM DD YYYY')}</Text>
        </HStack>
        <HStack>
            <Box p={2} borderRight='1px' borderColor='primary' cursor='pointer'>
                <Menu>
                    <MenuButton>
                        <Flex _hover={{ color: 'accent' }} alignItems='center'><Text color='white' mr='1'><FaUserCircle color='#87CEAA' size='24px' cursor='pointer' /></Text></Flex>
                    </MenuButton>
                    <MenuList>
                        <MenuItem color='black' cursor='default'>
                            {`Username: ${user && user?.userName}`}
                        </MenuItem>
                        <MenuItem _hover={{ color: 'accent' }} onClick={logout}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </HStack>
    </Flex>;
};
