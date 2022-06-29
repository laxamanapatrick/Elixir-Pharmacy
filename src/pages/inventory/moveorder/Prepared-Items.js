import React from 'react'
import { Badge, Button, Checkbox, Flex, FormLabel, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const PreparedItems = () => {

    return (
        <VStack w='full' spacing={0} justifyContent='center' mt={10}>
            <Text w='full' fontWeight='semibold' fontSize='md' bgColor='secondary' color='white' textAlign='center'>Prepared Items</Text>
            <PageScrollReusable minHeight='150px' maxHeight='200px'>
                <Table size='sm' variant='simple'>
                    <Thead bgColor='secondary'>
                        <Tr>
                            <Th color='white'>Line</Th>
                            <Th color='white'>Bardcode</Th>
                            <Th color='white'>Item Code</Th>
                            <Th color='white'>Item Description</Th>
                            <Th color='white'>Quantity</Th>
                            <Th color='white'>Expiration Date</Th>
                            <Th color='white'>Cancel</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>e</Td>
                            <Td>e</Td>
                            <Td>e</Td>
                            <Td>e</Td>
                            <Td>e</Td>
                            <Td>e</Td>
                            <Td><Button size='xs' colorScheme='red'>Cancel</Button></Td>
                        </Tr>
                        {/* {
                        orders?.map((item, i) =>
                            <Tr
                                bgColor={item.stockOnHand < item.quantityOrder ? '#dfdfdf5c' : 'none'}
                                color={item.stockOnHand < item.quantityOrder ? 'black' : 'none'}
                                _active={transactId ? { bgColor: 'accent', color: 'white' } : { bgColor: 'none' }}
                                _hover={transactId ? { bgColor: 'accent', color: 'white' } : { bgColor: 'none' }}
                                cursor='pointer'
                                key={i}
                            >
                                {
                                    item.stockOnHand < item.quantityOrder
                                        ?
                                        <Td><TiInfo fontSize='22px' color='red' title='Not enough stocks' /></Td>
                                        :
                                        <Td>
                                            <Checkbox
                                                onChange={childCheckHandler}
                                                isChecked={checkedItems.includes(item.id)}
                                                value={item.id}
                                                color='black'
                                            >
                                                {i + 1}
                                            </Checkbox>
                                        </Td>
                                }
                                <Td>{item.id}</Td>
                                <Td>{item.orderDate}</Td>
                                <Td>{item.dateNeeded}</Td>
                                <Td>{item.farm}</Td>
                                <Td>{item.farmCode}</Td>
                                <Td>{item.category.toUpperCase()}</Td>
                                <Td>{item.itemCode}</Td>
                                <Td>{item.itemDescription}</Td>
                                <Td>{item.uom}</Td>
                                <Td>{item.quantityOrder}</Td>
                                <Td>{item.stockOnHand}</Td>

                                <Td>
                                    <Button
                                        onClick={() => editHandler(item)}
                                        size='xs' colorScheme='yellow' color='white' px={4}
                                    >
                                        Edit
                                    </Button>
                                </Td>

                                <Td>
                                    <Button
                                        onClick={() => cancelHandler(item)}
                                        size='xs' colorScheme='red'
                                    >
                                        Cancel
                                    </Button>
                                </Td>

                            </Tr>
                        )
                    } */}
                    </Tbody>
                </Table>
            </PageScrollReusable>
        </VStack>
    )
}
