import React, { useState } from 'react'
import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const MRPTable = ({ mrpData }) => {

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
            <PageScrollReusable minHeight='665px' maxHeight='666px'>
                <Table size='sm'>
                    <Thead bgColor='secondary'>
                        <Tr>
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
                            mrpData?.map((item, i) =>
                                <Tr key={i}
                                // bgColor={item.bufferLevel > item.soh ? '#bf7889' : 'none'}
                                >
                                    <Td>{i + 1}</Td>
                                    <Td>{item.itemCode}</Td>
                                    <Td>{item.itemDescription}</Td>
                                    {
                                        !buttonChanger ?
                                            <>
                                                <Td>{item.itemCategory}</Td>
                                                <Td>{item.uom}</Td>
                                                <Td>{item.price}</Td>
                                                <Td>{item.soh}</Td>
                                                <Td>{item.reserve}</Td>
                                                <Td>{item.bufferLevel}</Td>
                                                <Td>{item.receiveIn}</Td>
                                          
                                            </>
                                            :
                                            <>
                                                <Td>{item.receiptIn}</Td>
                                                <Td>{item.moveOrderOut}</Td>
                                                <Td>{item.issueOut}</Td>
                                                <Td>{item.qcReceiving}</Td>
                                                <Td>{`Last Used`}</Td>
                                                <Td>{`Movement Status`}</Td>
                                                <Td>{`Classification ABC`}</Td>
                                                <Td>{item.suggestedPo}</Td>
                                            </>
                                    }
                                </Tr>
                            )
                        }
                    </Tbody>
                </Table>
            </PageScrollReusable>
        </Flex>
    )
}
