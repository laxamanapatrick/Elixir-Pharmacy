import React, { useState } from 'react'
import { Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { ReturnModal } from './Return-Modal'
import {
    Pagination,
    usePagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import moment from 'moment'

export const RejectedMoveOrder = ({ setCurrentPage, setPageSize, setSearch, pagesCount, currentPage, pageSize, rejectedData, fetchRejectedMO, fetchNotification }) => {

    const [orderNo, setOrderNo] = useState('')

    const { isOpen: isReturn, onOpen: openReturn, onClose: closeReturn } = useDisclosure()

    const TableHead = [
        "Line", "Order ID", "Customer Code", "Customer Name", "Category", "Total Quantity Order", "Prepared Date",
        // "Date Needed", 
        // "Reject Date", 
        "Remarks", "Reject"
    ]

    const handlePageChange = (nextPage) => {
        setCurrentPage(nextPage)
    }

    const handlePageSizeChange = (e) => {
        const pageSize = Number(e.target.value)
        setPageSize(pageSize)
    }

    const searchHandler = (inputValue) => {
        setSearch(inputValue)
    }

    const returnHandler = (id) => {
        if (id) {
            setOrderNo(id)
            openReturn()
        } else {
            setOrderNo(id)
        }
    }

    return (
        <Flex w='full' flexDirection='column' p={5}>
            <Flex justifyContent='space-between'>
                <Select
                    onChange={handlePageSizeChange}
                    w='7%' variant='filled'
                >
                    <option value={Number(10)}>10</option>
                    <option value={Number(20)}>20</option>
                    <option value={Number(30)}>30</option>
                    <option value={Number(50)}>50</option>
                </Select>
                <HStack w='17%'>
                    <Text>Search:</Text>
                    <Input placeholder='Order Id' onChange={(e) => searchHandler(e.target.value)} />
                </HStack>
            </Flex>

            <Flex mt={5}>
                <PageScrollReusable minHeight='200px' maxHeight='500px'>
                    <Table size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                {TableHead?.map((head, i) => <Th key={i} color='white'>{head}</Th>)}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                rejectedData?.moveorder?.map((data, i) =>
                                    <Tr key={i}>
                                        <Td>{i + 1}</Td>
                                        <Td>{data.orderNo}</Td>
                                        <Td>{data.farmCode}</Td>
                                        <Td>{data.farmName}</Td>
                                        <Td>{data.category}</Td>
                                        <Td>{data.quantity}</Td>
                                        <Td>{moment(data.preparedDate).format("MM/DD/yyyy")}</Td>
                                        {/* <Td>{data.dateNeeded}</Td> */}
                                        {/* <Td>{moment(data.rejectedDate).format("MM/DD/yyyy")}</Td> */}
                                        <Td>{data.remarks}</Td>
                                        <Td>
                                            <Button colorScheme='red' size='xs' onClick={() => returnHandler(data.orderNo)}>
                                                Return
                                            </Button>
                                        </Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>

            <Flex justifyContent='space-between' mt={7}>
                <Text fontSize='xs'>
                    {rejectedData?.moveorder?.length > 0 ? `Showing ${rejectedData?.moveorder?.length} entries` : 'No entries available'}
                </Text>
                
                <Flex>
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

            </Flex>

            {
                isReturn && (
                    <ReturnModal
                        isOpen={isReturn}
                        onClose={closeReturn}
                        orderNo={orderNo}
                        fetchRejectedMO={fetchRejectedMO}
                        fetchNotification={fetchNotification}
                    />
                )
            }

        </Flex>
    )
}
