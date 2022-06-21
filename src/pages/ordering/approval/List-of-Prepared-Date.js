import React from 'react'
import { Flex, HStack, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofPreparedDate = () => {
    return (
        <Flex w='95%' p={10} flexDirection='column'>
            <HStack justifyContent='start' w='13%'>
                <Text fontSize='sm'>STATUS: </Text>
                <Select size='sm'>
                    <option>PENDING</option>
                </Select>
            </HStack>

            <Flex mt={10}>
                <Text></Text>
                <PageScrollReusable>
                    <Table size='sm' variant='simple'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>e</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>a</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>



        </Flex>
    )
}
