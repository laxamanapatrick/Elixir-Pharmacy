import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import PageScrollTransformation from '../../../components/PageScroll-Transformation'

export const ListofRequirements = ({ requirements, requests }) => {

    return (
        <Flex w='full' flexDirection='column'>
            <Text color='white' bgColor='secondary' textAlign='center'>List of Raw Materials Requirements</Text>

            <Flex>
                <PageScrollTransformation minHeight='100px' maxHeight='270px'>
                    <Table variant='striped' size='sm'>
                        <Thead>
                            <Tr bgColor='secondary'>
                                <Th color='white'>Line</Th>
                                <Th color='white'>Transform ID</Th>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                <Th color='white'>Batch</Th>
                                <Th color='white'>Quantity Batch</Th>
                                <Th color='white'>Total Quantity</Th>
                                <Th color='white'>Weighing Scale</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                requirements?.map((item, i) =>
                                    <Tr key={i}>
                                        <Td>{i + 1}</Td>
                                        <Td>{item.transformId}</Td>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        <Td>{item.batch}</Td>
                                        <Td>{item.quantityBatch}</Td>
                                        <Td>{item.totalQuantity}</Td>
                                        <Td>{item.weighingScale}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Text fontSize='xs' mb={7}>Number of Records: {requirements?.length}</Text>
        </Flex>
    )
}
