import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofMoveOrdersPerFarm = () => {

    const TableHead = [
        "Line", "Order Date", "Farm Code", "Farm", "Category", "Item Code", "Item Description", "UOM", "Expiration Date", "Quantity"
    ]

    return (
        <Flex w='full' flexDirection='column' borderX='1px' borderBottom='1px'>
            <VStack spacing={0}>
                <Text pb={2} textAlign='center' fontSize='md' color='white' bgColor='secondary' w='full' mb={-1.5}>List of Move Orders</Text>
                <PageScrollReusable minHeight='220px' maxHeight='350px'>
                    <Table size='sm' variant='simple'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                {
                                    TableHead?.map((t, i) =>
                                        <Th color='white' key={i}>{t}</Th>
                                    )
                                }
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>e</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </VStack>
        </Flex>
    )
}



