import React, { useState } from 'react'
import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const MRPTable = () => {

    const [buttonChanger, setButtonChanger] = useState(false)

    return (
        <Flex w='full' justifyContent='center' flexDirection='column'>
            <Flex justifyContent='end' mb={1}>
                <Button
                    onClick={() => setButtonChanger(!buttonChanger)}
                    size='xs' px={5} colorScheme='blue'
                >
                    {buttonChanger ? '<< Previous' : 'Next >>'}
                </Button>
            </Flex>
            <PageScrollReusable minHeight='480px' maxHeight='520px'>
                <Table size='sm'>
                    <Thead bgColor='secondary'>
                        <Tr>
                            <Th color='white'>ID</Th>
                            <Th color='white'>Item Code</Th>
                            <Th color='white'>Item Description</Th>
                            {
                                buttonChanger ?
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
                                    </>
                            }
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Body</Td>
                            <Td>Body</Td>
                            <Td>Body</Td>
                            {
                                buttonChanger ?
                                    <>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                    </>
                                    :
                                    <>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                        <Td>Body</Td>
                                    </>
                            }
                        </Tr>
                    </Tbody>
                </Table>
            </PageScrollReusable>
        </Flex>
    )
}
