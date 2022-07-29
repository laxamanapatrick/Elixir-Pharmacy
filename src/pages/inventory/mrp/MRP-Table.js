import React, { useState } from 'react'
import { Button, Flex, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { BiRightArrow } from 'react-icons/bi'

export const MRPTable = ({ mrpData, setSelectorId, selectorId, setRawMatsInfo }) => {

    const [buttonChanger, setButtonChanger] = useState(false)

    const selectorHandler = (id, { itemCode, itemDescription, soh, bufferLevel, suggestedPo, lastUsed }) => {
        if (id) {
            setSelectorId(id)
            setRawMatsInfo({
                itemCode: itemCode,
                itemDescription: itemDescription,
                soh: soh,
                bufferLevel: bufferLevel,
                suggestedPo: suggestedPo,
                lastUsed: 'No data on backend yet'
            })
        } else {
            setSelectorId('')
            setRawMatsInfo({
                itemCode: '',
                itemDescription: '',
                soh: '',
                bufferLevel: '',
                suggestedPo: '',
                lastUsed: ''
            })
        }
    }

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
            <PageScrollReusable minHeight='657px' maxHeight='658px'>
                <Table size='sm'>
                    <Thead bgColor='secondary'>
                        <Tr>
                            <Th p={0} color='white'></Th>
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
                                    onClick={() => selectorHandler(i + 1, item)}
                                    bgColor={
                                        selectorId === i + 1 ? 'table_accent' : 'none'
                                            &&
                                            item.bufferLevel > item.reserve ? 'pink' : 'none'
                                    }
                                    cursor='pointer'
                                >
                                    {
                                        selectorId === i + 1 ?
                                            <Td p={0}><BiRightArrow /></Td>
                                            :
                                            <Td p={0}></Td>
                                    }
                                    <Td>{i + 1}</Td>
                                    <Td>{item.itemCode}</Td>
                                    <Td>{item.itemDescription}</Td>
                                    {
                                        !buttonChanger ?
                                            <>
                                                <Td>{item.itemCategory}</Td>
                                                <Td>{item.uom}</Td>
                                                <Td>{item.price.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.soh.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.reserve.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.bufferLevel.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.receiveIn.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>

                                            </>
                                            :
                                            <>
                                                <Td>{item.receiptIn.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.moveOrderOut.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.issueOut.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{item.qcReceiving.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                                <Td>{`Last Used`}</Td>
                                                <Td>{`Movement Status`}</Td>
                                                <Td>{`Classification ABC`}</Td>
                                                <Td>{item.suggestedPo.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
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
