import React, { useState } from 'react'
import { Flex, HStack, Input, Skeleton, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { HiRefresh } from 'react-icons/hi'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofOrders = () => {

    const [isLoading, setIsLoading] = useState(false)

    return (
        <Flex w='full' p={5} flexDirection='column'>

            <Flex w='full' p={2} justifyContent='space-between'>
                <HStack>
                    <Text fontSize='sm'>SEARCH:</Text>

                    <Input disabled={isLoading} />
                </HStack>
                {
                    isLoading ?
                        <Spinner cursor='pointer' onClick={() => setIsLoading(false)} />
                        :
                        <HiRefresh fontSize='25px' cursor='pointer' onClick={() => setIsLoading(true)} />
                }
            </Flex>

            <VStack spacing={0} w='full'>
                <Text py={2} w='full' fontSize='lg' bgColor='secondary' color='white' textAlign='center'>List of Orders</Text>
                <PageScrollReusable minHeight='200px' maxHeight='500px'>
                    {
                        isLoading ?
                            <Stack width="full">
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                            </Stack>
                            :
                            <Table size='sm'>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        <Th color='white'>Line</Th>
                                        <Th color='white'>Order Date</Th>
                                        <Th color='white'>Date Needed</Th>
                                        <Th color='white'>Farm</Th>
                                        <Th color='white'>Farm Code</Th>
                                        <Th color='white'>Category</Th>
                                        <Th color='white'>Item Code</Th>
                                        <Th color='white'>Item Description</Th>
                                        <Th color='white'>UOM</Th>
                                        <Th color='white'>Quantity Order</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                        <Td>Data</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                    }
                </PageScrollReusable>
            </VStack>

            <Text fontSize='xs'>Number of records: </Text>

        </Flex >
    )
}
