import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofReceipt = () => {

    const TableHead = [
        "Line", "Item Code", "Item Description", "Category", "UOM", "Quantity", "Supplier", "Expiration Date"
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
                                    {TableHead?.map((item, i) => <Th color='white' key={i}>{item}</Th>) }
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>Hi</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </PageScrollReusable>
                </Flex>
            </VStack>
        </Flex>

    )
}
