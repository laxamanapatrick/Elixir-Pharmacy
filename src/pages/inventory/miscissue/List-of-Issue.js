import React, { useEffect } from 'react'
import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofIssue = ({ miscData, selectorId, setSelectorId, setEditableData, setRowIndex, setTotalQuantity }) => {

    const TableHead = [
        "Line", "ID", "Item Code", "Item Description",
        // "Category", 
        "UOM", "Quantity",
        // "Customer", 
        "Expiration Date"
    ]

    const rowHandler = ({ id }) => {
        setSelectorId(id)
        // const index = miscData.indexOf(item)
    }

    useEffect(() => {
        if (miscData.length) {
            let sumQuantity = miscData.map((q) => parseFloat(q.totalQuantity))
            let sum = sumQuantity.reduce((a, b) => a + b)
            setTotalQuantity(sum)
        }

    }, [miscData])

    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <VStack justifyContent='center' w='full' spacing={-1}>
                <Text bgColor='secondary' w='full' color='white' textAlign='center' fontWeight='semibold' py={1}>List of Receipt</Text>
                <Flex justifyContent='center' w='full'>
                    <PageScrollReusable minHeight='550px' maxHeight='570px'>
                        <Table size='sm'>
                            <Thead bgColor='secondary'>
                                <Tr>
                                    {TableHead?.map((item, i) => <Th color='white' key={i}>{item}</Th>)}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    miscData?.map((item, i) =>
                                        <Tr key={i}
                                            onClick={() => rowHandler(item)}
                                            bgColor={selectorId === item.id ? 'table_accent' : 'none'}
                                            cursor='pointer'
                                        >
                                            <Td>{i + 1}</Td>
                                            <Td>{item?.id}</Td>
                                            <Td>{item?.itemCode}</Td>
                                            <Td>{item?.itemDescription}</Td>
                                            <Td>{item?.uom}</Td>
                                            <Td>{item?.totalQuantity}</Td>
                                            {/* <Td>{item?.customer}</Td> */}
                                            <Td>{item?.expirationDate}</Td>
                                        </Tr>
                                    )
                                }
                            </Tbody>
                        </Table>
                    </PageScrollReusable>
                </Flex>
            </VStack>
        </Flex>

    )
}
