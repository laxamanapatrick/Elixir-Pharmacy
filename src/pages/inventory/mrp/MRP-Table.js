import React, { useState } from 'react'
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import {
    Pagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { BiRightArrow } from 'react-icons/bi'
import { FaSearch } from 'react-icons/fa'

export const MRPTable = ({ mrpData, setSelectorId, selectorId, setRawMatsInfo, pagesCount, pages, currentPage, setCurrentPage, setPageSize, setSearch }) => {

    const [buttonChanger, setButtonChanger] = useState(false)

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

    const selectorHandler = (id, { itemCode, itemDescription, soh, bufferLevel, suggestedPo, lastUsed }) => {
        if (id) {
            setSelectorId(id)
            setRawMatsInfo({
                itemCode: itemCode,
                itemDescription: itemDescription,
                soh: soh,
                bufferLevel: bufferLevel,
                suggestedPo: suggestedPo,
                lastUsed: 'No data'
            })
        } else {
            setSelectorId('')
            setRawMatsInfo({
                itemCode: '',
                itemDescription: '',
                soh: '',
                bufferLevel: '',
                suggestedPo: '',
                lastUsed: ''
            })
        }
    }

    return (
        <Flex w='full' justifyContent='center' flexDirection='column'>
            <Flex justifyContent='space-between' mb={1}>
                <InputGroup w='15%'>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<FaSearch color='gray.300' />}
                    />
                    <Input
                        onChange={(e) => searchHandler(e.target.value)}
                        type='text' placeholder='Search: Item Code'
                        focusBorderColor='accent'
                    />
                </InputGroup>
                <Button
                    onClick={() => setButtonChanger(!buttonChanger)}
                    size='xs' px={5} colorScheme='blue'
                >
                    {buttonChanger ? '<< Previous' : 'Next >>'}
                </Button>
            </Flex>
            <PageScrollReusable minHeight='617px' maxHeight='618px'>
                <Table size='sm'>
                    <Thead bgColor='secondary'>
                        <Tr>
                            <Th p={0} color='white'></Th>
                            <Th color='white'>ID</Th>
                            <Th color='white'>Item Code</Th>
                            <Th color='white'>Item Description</Th>
                            {
                                !buttonChanger ?
                                    <>
                                        <Th color='white'>Item Category</Th>
                                        <Th color='white'>UOM</Th>
                                        <Th color='white'>Price</Th>
                                        <Th color='white'>SOH</Th>
                                        <Th color='white'>Reserve</Th>
                                        <Th color='white'>Buffer Level</Th>
                                        <Th color='white'>{`Receive (IN)`}</Th>
                                    </>
                                    :
                                    <>
                                        <Th color='white'>{`Receipt (IN)`}</Th>
                                        <Th color='white'>{`Move Order (OUT)`}</Th>
                                        <Th color='white'>{`Issue (OUT)`}</Th>
                                        <Th color='white'>QA Receiving</Th>
                                        <Th color='white'>Last Used</Th>
                                        <Th color='white'>Movement Status</Th>
                                        <Th color='white'>Classification ABC</Th>
                                        <Th color='white'>Suggested PO</Th>
                                    </>
                            }
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            mrpData?.inventory?.map((item, i) =>
                                <Tr key={i}
                                    onClick={() => selectorHandler(i + 1, item)}
                                    bgColor={
                                        selectorId === i + 1 ? 'table_accent' : 'none'
                                            &&
                                            item.bufferLevel > item.reserve ? 'pink' : 'none'
                                    }
                                    cursor='pointer'
                                >
                                    {
                                        selectorId === i + 1 ?
                                            <Td p={0}><BiRightArrow /></Td>
                                            :
                                            <Td p={0}></Td>
                                    }
                                    <Td>{i + 1}</Td>
                                    <Td>{item.itemCode}</Td>
                                    <Td>{item.itemDescription}</Td>
                                    {
                                        !buttonChanger ?
                                            <>
                                                <Td>{item.itemCategory}</Td>
                                                <Td>{item.uom}</Td>
                                                <Td>{item.price.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.soh.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.reserve.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.bufferLevel.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.receiveIn.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>

                                            </>
                                            :
                                            <>
                                                <Td>{item.receiptIn.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.moveOrderOut.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.issueOut.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.qcReceiving.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{`Last Used`}</Td>
                                                <Td>{`Movement Status`}</Td>
                                                <Td>{`Classification ABC`}</Td>
                                                <Td>{item.suggestedPo.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                            </>
                                    }
                                </Tr>
                            )
                        }
                    </Tbody>
                </Table>
            </PageScrollReusable>

            <Flex mt={5} justifyContent='end' w='full'>
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
                                    <option value={Number(50)}>50</option>
                                    <option value={Number(5)}>5</option>
                                    <option value={Number(10)}>10</option>
                                    <option value={Number(25)}>25</option>
                                </Select>
                            </HStack>
                        </PaginationContainer>
                    </Pagination>
                </Stack>
            </Flex>

        </Flex>
    )
}
