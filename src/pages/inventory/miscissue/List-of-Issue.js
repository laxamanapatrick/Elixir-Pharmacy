import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofIssue = ({ listDataTempo, selectorId, setSelectorId, setEditableData }) => {

    const TableHead = [
        "Line", "Item Code", "Item Description",
        // "Category", 
        "UOM", "Quantity", "Customer", "Expiration Date"
    ]

    const rowHandler = (list, i) => {
        setSelectorId(i+1)
        setEditableData(list)
    }

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
                                    listDataTempo?.map((item, i) =>
                                        <Tr key={i}
                                        onClick={() => rowHandler(item,i)}
                                        bgColor={selectorId === i+1 ? 'table_accent' : 'none'}
                                        >
                                            <Td>{i+1}</Td>
                                            <Td>{item?.itemCode}</Td>
                                            <Td>{`Desc`}</Td>
                                            <Td>{item?.uom}</Td>
                                            <Td>{item?.quantity}</Td>
                                            <Td>{item?.customer}</Td>
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
