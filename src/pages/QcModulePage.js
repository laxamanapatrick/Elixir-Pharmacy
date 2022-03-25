import React, { useContext } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Context } from '../context/Context';

const QcModulePage = () => {
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

        {/* <HStack mt={5} mx='200px' justifyContent='space-between'>

            <Box p={6} px='160px' py='40px' bgColor='#009B86'>
                <Text>Sample</Text>
            </Box>

            <Box p={6} px='160px' py='40px' bgColor='#A5ED27'>
                <Text>Sample</Text>
            </Box>

            <Box p={6} px='160px' py='40px' bgColor='#FF0000'>
                <Text>Sample</Text>
            </Box>
        </HStack>

        <HStack mt={5} mx='200px' justifyContent='space-between'>
            <Box p={6} px='160px' py='40px' bgColor='#009B86'>
                <Text>Sample</Text>
            </Box>

            <Box p={6} px='160px' py='40px' bgColor='#A5ED27'>
                <Text>Sample</Text>
            </Box>

            <Box p={6} px='160px' py='40px' bgColor='#FF0000'>
                <Text>Sample</Text>
            </Box>
        </HStack> */}

    </Flex>;
};

export default QcModulePage