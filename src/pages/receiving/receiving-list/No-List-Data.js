import React from 'react'
import {
    Box,
    Flex,
    Text,
    VStack
} from '@chakra-ui/react'
import { FaRegFolderOpen } from 'react-icons/fa'

const NoListData = () => {
    return (
        <Flex justifyContent='center'>
            <Box justifyContent='center' mt='180px' height='50vh'>
                <VStack spacing='30px'>
                    <Flex>
                        <FaRegFolderOpen fontSize='300px' />
                    </Flex>
                    <Flex>
                        <Text fontWeight='semibold' color='secondary'>There are no items being received at the moment</Text>
                    </Flex>
                </VStack>
            </Box>
        </Flex >
    )
}

export default NoListData