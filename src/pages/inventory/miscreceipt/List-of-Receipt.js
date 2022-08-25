import React, { useEffect } from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofReceipt = ({ listDataTempo, selectorId, setSelectorId, setEditableData, setRowIndex, setTotalQuantity }) => {

    const TableHead = [
        "Line", "Item Code", "Item Description",
        // "Category", 
        "UOM", "Quantity",
        // "Supplier", 
        "Expiration Date"
    ]

    const rowHandler = (item, i) => {
        setSelectorId(i + 1)
        setEditableData(item)
        const index = listDataTempo.indexOf(item)
        setRowIndex(index)
    }

    useEffect(() => {
        if (listDataTempo.length) {
            let sumQuantity = listDataTempo.map((q) => parseFloat(q.quantity))
            let sum = sumQuantity.reduce((a, b) => a + b)
            setTotalQuantity(sum)
        }

    }, [listDataTempo])

    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <VStack justifyContent='center' w='full' spacing={-1}>
                <Text bgColor='secondary' w='full' color='white' textAlign='center' fontWeight='semibold' py={1}>List of Receipt</Text>
                <Flex justifyContent='center' w='full'>
                    <PageScrollReusable minHeight='450px' maxHeight='451px'>
                        <Table size='sm'>
                            <Thead bgColor='secondary'>
                                <Tr>
                                    {TableHead?.map((item, i) => <Th color='white' key={i}>{item}</Th>)}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    listDataTempo?.map((item, i) =>
                                        <Tr key={i}
                                            onClick={() => rowHandler(item, i)}
                                            bgColor={selectorId === i + 1 ? 'table_accent' : 'none'}
                                            cursor='pointer'
                                        >
                                            <Td>{i + 1}</Td>
                                            <Td>{item?.itemCode}</Td>
                                            <Td>{item?.itemDescription}</Td>
                                            <Td>{item?.uom}</Td>
                                            <Td>{item?.quantity}</Td>
                                            {/* <Td>{item?.supplier}</Td> */}
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
