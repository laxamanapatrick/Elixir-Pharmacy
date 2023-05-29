import React, { useEffect, useState } from 'react'
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import {
    Pagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import PageScrollReusable from '../../../../components/PageScroll-Reusable'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'
import { StatusConfirmation, ViewModal } from './Action-Modals'



export const ListofReceipts = ({ receiptData, setCurrentPage, setPageSize, setStatus, setSearch, pagesCount, currentPage, pages, fetchReceipts }) => {

    const [statusBody, setStatusBody] = useState({
        id: '',
        status: ''
    })

    const { isOpen: isStatus, onClose: closeStatus, onOpen: openStatus } = useDisclosure()
    const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure()

    const handlePageChange = (nextPage) => {
        setCurrentPage(nextPage)
    }

    const handlePageSizeChange = (e) => {
        const pageSize = Number(e.target.value)
        setPageSize(pageSize)
    }

    // const statusHandler = (data) => {
    //     setStatus(data)
    // }

    const searchHandler = (inputValue) => {
        setSearch(inputValue)
    }

    // const changeStatusHandler = (id, status) => {
    //     if (id) {
    //         setStatusBody({
    //             id: id,
    //             status: status
    //         })
    //         openStatus()
    //     } else {
    //         setStatusBody({
    //             id: '',
    //             status: ''
    //         })
    //     }
    // }

    const viewHandler = (id, status) => {
        if (id) {
            setStatusBody({
                id: id,
                status: status
            })
            openView()
        } else {
            setStatusBody({
                id: '',
                status: ''
            })
        }
    }

    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <Flex justifyContent='space-between'>
                <InputGroup w='15%'>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<FaSearch color='gray.300' />}
                    />
                    <Input
                        onChange={(e) => searchHandler(e.target.value)}
                        type='text' placeholder='Search: ID'
                        focusBorderColor='accent'
                    />
                </InputGroup>

                {/* <HStack w='15%'>
                    <Text>STATUS: </Text>

                    <Select onChange={(e) => statusHandler(e.target.value)}>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </Select>
                </HStack> */}
            </Flex>

            <Flex mt={5}>
                <PageScrollReusable minHeight='750px' maxHeight='751px'>
                    <Table size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>ID</Th>
                                <Th color='white'>Supplier Code</Th>
                                <Th color='white'>Supplier Name</Th>
                                <Th color='white'>Total Quantity</Th>
                                <Th color='white'>Date Input</Th>
                                <Th color='white'>Transacted By</Th>
                                <Th color='white'>View</Th>
                                {/* <Th color='white'>Change status</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                receiptData?.receipt?.map((receipt, i) =>
                                    <Tr key={i}>
                                        <Td>{receipt.id}</Td>
                                        <Td>{receipt.supplierCode}</Td>
                                        <Td>{receipt.supplierName}</Td>
                                        <Td>{receipt.totalQuantity}</Td>
                                        <Td>{receipt.preparedDate}</Td>
                                        <Td>{receipt.preparedBy}</Td>
                                        <Td>
                                            <Button
                                                onClick={() => viewHandler(receipt.id, receipt.isActive)}
                                                colorScheme='blue' size='xs'
                                            >
                                                View
                                            </Button>
                                        </Td>
                                        {/* <Td>
                                            <Button
                                                onClick={() => changeStatusHandler(receipt.id, receipt.isActive)}
                                                colorScheme='red' size='xs'
                                            >
                                                {receipt.isActive ? 'Inactivate' : 'Activate'}
                                            </Button>
                                        </Td> */}
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>

            <Flex mt={5} justifyContent='end'>
                <Stack>
                    <Pagination
                        pagesCount={pagesCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    >
                        <PaginationContainer>
                            <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
                            <PaginationPageGroup ml={1} mr={1}>
                                {pages.map((page) => (
                                    <PaginationPage
                                        _hover={{ bg: 'accent', color: 'white' }}
                                        p={3}
                                        bg="secondary"
                                        color='white'
                                        key={`pagination_page_${page}`}
                                        page={page}
                                    />
                                ))}
                            </PaginationPageGroup>
                            <HStack>
                                <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                                <Select onChange={handlePageSizeChange} variant='filled'>
                                    <option value={Number(5)}>5</option>
                                    <option value={Number(10)}>10</option>
                                    <option value={Number(25)}>25</option>
                                    <option value={Number(50)}>50</option>
                                </Select>
                            </HStack>
                        </PaginationContainer>
                    </Pagination>
                </Stack>
            </Flex>

            {/* {
                isStatus && (
                    <StatusConfirmation
                        isOpen={isStatus}
                        onClose={closeStatus}
                        statusBody={statusBody}
                        fetchReceipts={fetchReceipts}
                    />
                )
            } */}

            {
                isView && (
                    <ViewModal
                        isOpen={isView}
                        onClose={closeView}
                        statusBody={statusBody}
                    />
                )
            }

        </Flex>
    )
}
