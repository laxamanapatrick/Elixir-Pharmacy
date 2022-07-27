import React, { useState, useEffect } from 'react'
import { Badge, Button, Flex, HStack, Select, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import {
    Pagination,
    usePagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import PageScrollTransformation from '../../../components/PageScroll-Transformation'

export const ListofRequest = ({ setTransformId, transformId, setBatchRemaining, setCurrentPage, 
    currentPage, pagesCount, requests, setQuantity, setBatch, setMixingCue }) => {

    useEffect(() => {
        const requestData = requests?.mixing
        if (requestData) {
            setTransformId(requestData[0]?.id)
            setBatchRemaining(requestData[0]?.batchRemaining)
            setQuantity(requestData[0]?.quantity)
            setBatch(requestData[0]?.batch)
        }
    }, [requests])

    const handlePageChange = (nextPage) => {
        setCurrentPage(nextPage)
        setMixingCue(false)
    }

    return (
        <Flex w='full' flexDirection='column'>
            <Flex w='full' justifyContent='space-between'>
                <HStack spacing={0} mr={8}>
                    <Badge py={1} px={5} mr={2} bgColor='secondary' color='white' fontWeight='semibold'>Transform ID: </Badge>
                    <Text fontWeight='semibold' fontSize='sm'>{transformId && transformId}</Text>
                </HStack>
                {/* <Button variant='outline' size='xs' px={5}>Previous</Button>
                <Text mx={2} fontSize='sm'>1</Text>
                <Button variant='outline' size='xs' px={8}>Next</Button> */}

                <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                >
                    <PaginationContainer>
                        <PaginationPrevious
                            border='1px' fontSize='xs' px={2} _hover={{ bg: 'accent', color: 'white' }}
                        >
                            {"< Previous"}
                        </PaginationPrevious>
                        <Text mx={1} bgColor='secondary' color='white' px={2} pt={1.5} >{currentPage}</Text>
                        <PaginationNext
                            border='1px' fontSize='xs' px={4} _hover={{ bg: 'accent', color: 'white' }}
                        >
                            {"Next >"}
                        </PaginationNext>
                    </PaginationContainer>
                </Pagination>

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
                            {
                                requests?.mixing?.map((item, i) =>
                                    <Tr
                                        bgColor={transformId == item.id ? 'table_accent' : 'none'}
                                        key={i}
                                    >
                                        <Td>{i + 1}</Td>
                                        <Td>{item.id}</Td>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        <Td>{item.batch}</Td>
                                        <Td>{item.version}</Td>
                                        <Td>{item.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                        <Td>{item.prodPlan}</Td>
                                        <Td>{"IN-PROCESS"}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Text fontSize='xs' mb={7}>Number of Records:  {requests?.mixing?.length}</Text>
        </Flex>
    )
}
