import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = (props) => {
    const { pathname } = useLocation()
    const { menus } = props

    return (
        <Flex>
            {menus.subMenu.map((sub) => (
                <Link to={sub.path} key={sub.title}>
                    <Box bgColor={pathname.includes(sub.path) ? 'accent' : 'secondary'} p={2} borderBottom='1px' borderColor='primary' cursor='pointer' _hover={{ bgColor: 'accent' }}>
                        <Text color='white'>{sub.title}</Text>
                    </Box>
                </Link>
            ))}
        </Flex>
    )
}
export default Navbar