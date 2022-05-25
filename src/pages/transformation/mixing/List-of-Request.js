import React from 'react'
import { Badge, Button, Flex, HStack, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import PageScrollTransformation from '../../../components/PageScroll-Transformation'

export const ListofRequest = () => {

    return (
        <Flex w='full' flexDirection='column'>
            <Flex w='full' justifyContent='start'>
                <HStack spacing={0} mr={8}>
                    <Badge py={1} px={5} mr={2} bgColor='secondary' color='white' fontWeight='semibold'>Transform ID: </Badge>
                    <Text fontWeight='semibold' fontSize='sm'>213123231</Text>
                </HStack>
                <Button variant='outline' size='xs' px={5}>Previous</Button>
                <Text mx={2} fontSize='sm'>1</Text>
                <Button variant='outline' size='xs' px={8}>Next</Button>
            </Flex>

            <Text mt={2} color='white' bgColor='secondary' textAlign='center'>List of Request</Text>
            <Flex>
                <PageScrollTransformation minHeight='100px' maxHeight='270px'>
                    <Table variant='simple' size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Line</Th>
                                <Th color='white'>Transform ID</Th>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                <Th color='white'>Batch</Th>
                                <Th color='white'>Version</Th>
                                <Th color='white'>Quantity</Th>
                                <Th color='white'>Prod Plan</Th>
                                <Th color='white'>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                                <Td>Hi</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Text fontSize='xs' mb={7}>Number of Records: </Text>
        </Flex>
    )
}
