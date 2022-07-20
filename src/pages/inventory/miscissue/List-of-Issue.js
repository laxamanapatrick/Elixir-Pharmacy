import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofIssue = ({ listDataTempo }) => {

    const TableHead = [
        "Line", "Item Code", "Item Description",
        // "Category", 
        "UOM", "Quantity", "Customer", "Expiration Date"
    ]

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
                                <Tr>
                                    <Td>{1}</Td>
                                    <Td>{listDataTempo.itemCode}</Td>
                                    <Td>{`Desc`}</Td>
                                    <Td>{listDataTempo.uom}</Td>
                                    <Td>{listDataTempo.quantity}</Td>
                                    <Td>{listDataTempo.supplier}</Td>
                                    <Td>{listDataTempo.expirationDate}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </PageScrollReusable>
                </Flex>
            </VStack>
        </Flex>

    )
}
