import React from 'react'
import { Badge, Flex, HStack, Select, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import {
    Pagination,
    usePagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { VscCircleLargeFilled } from 'react-icons/vsc'
import { GoArrowSmallRight } from 'react-icons/go'
import moment from 'moment'

export const ListofApprovedDate = ({ farmName, moveData, pagesCount, currentPage,
    setCurrentPage, setItemCode, setWarehouseId, setHighlighterId, setOrderId, orderId, setPlateNumber, buttonChanger }) => {

    const handlePageChange = (nextPage) => {
        setCurrentPage(nextPage)
        setItemCode('')
        setWarehouseId('')
        setHighlighterId('')
        setOrderId('')
    }

    const handleId = (data) => {
        setItemCode('')
        setHighlighterId('')
        setPlateNumber('')
        if (data) {
            setOrderId(data)
        } else {
            setOrderId('')
        }
    }

    const TableHead = [
        "Line", "Order ID", "Farm", "Farm Code", "Category", "Total Quantity Order", "Order Date", "Date Needed", "Prepared Date", "Status"
    ]

    return (
        <Flex w='full' flexDirection='column'>
            <Flex w='full' justifyContent='space-between'>
                <HStack w='40%'>
                    <Badge bgColor='secondary' color='white' px={3}>Farm: </Badge>
                    <Text fontSize='sm'>{farmName && farmName}</Text>
                </HStack>

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
                buttonChanger ?
                    <HStack w='full' justifyContent='start'>
                        <Badge bgColor='secondary' color='white' px={3}>Plate Number: </Badge>
                        <Select
                            onChange={(e) => setPlateNumber(e.target.value)}
                            placeholder='Please select a plate number'
                            w='15%' size='xs' bgColor='#fff8dc'
                        >
                            <option>CAR 1002</option>
                            <option>EHS 228</option>
                            <option>JYP 069</option>
                            <option>PAT 625</option>
                        </Select>
                    </HStack>
                    :
                    ''
            }

            <VStack w='full' spacing={0} justifyContent='center' mt={6}>
                <Text w='full' fontWeight='semibold' fontSize='md' bgColor='secondary' color='white' textAlign='center'>List of Approved Date</Text>
                <PageScrollReusable minHeight='200px' maxHeight='210px'>
                    <Table size='sm' variant='simple'>
                        <Thead bgColor='secondary'>
                            <Tr>{TableHead?.map((head, i) => <Th key={i} color='white'>{head}</Th>)}</Tr>
                        </Thead>
                        <Tbody>
                            {
                                moveData?.map((order, i) =>
                                    <Tr key={i}
                                        title={order.isReject ? order.remarks : ''}
                                        onClick={() => handleId(order.id)}
                                        bgColor={orderId === order.id ? 'table_accent' : 'none'}
                                        _hover={order.isReject ? { bgColor: 'gray.200' } : { bgColor: 'none' }}
                                        cursor='pointer'
                                    >
                                        {orderId === order.id
                                            ?
                                            <Td><GoArrowSmallRight fontSize='27px' /></Td>
                                            :
                                            <Td>{i + 1}</Td>
                                        }
                                        <Td>{order.id}</Td>
                                        <Td>{order.farm}</Td>
                                        <Td>{order.farmCode}</Td>
                                        <Td>{order.category}</Td>
                                        <Td>{order.totalOrders}</Td>
                                        <Td>{order.orderDate}</Td>
                                        <Td>{order.dateNeeded}</Td>
                                        <Td>{moment(order.preparedDate).format("MM/DD/yyyy")}</Td>
                                        <Td>{order.isReject ?
                                            <VscCircleLargeFilled color='red' /> : <VscCircleLargeFilled color='green' />
                                        }</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </VStack>

        </Flex>
    )
}
