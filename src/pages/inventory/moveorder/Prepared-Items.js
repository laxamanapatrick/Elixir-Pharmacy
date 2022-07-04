import React, { useState } from 'react'
import { Button, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'
import { CancelConfirmation } from './Action-Modals'

export const PreparedItems = ({ preparedData, fetchPreparedItems, fetchOrderList }) => {

    const [cancelId, setCancelId] = useState('')

    const { isOpen: isCancel, onClose: closeCancel, onOpen: openJaypeeBardagulan } = useDisclosure()

    const TableHead = [
        "Line",
        "Barcode", "Item Code",
        "Item Description", "Quantity",
        "Expiration Date", "Cancel"
    ]

    const cancelHandler = (id) => {
        if (id) {
            setCancelId(id)
            openJaypeeBardagulan()
        } else {
            setCancelId('')
        }
    }

    return (
        <VStack w='full' spacing={0} justifyContent='center' mt={10}>
            <Text w='full' fontWeight='semibold' fontSize='md' bgColor='secondary' color='white' textAlign='center'>Prepared Items</Text>
            <PageScrollReusable minHeight='150px' maxHeight='200px'>
                <Table size='sm' variant='simple'>
                    <Thead bgColor='secondary'>
                        <Tr>{TableHead?.map((head, i) => <Th key={i} color='white'>{head}</Th>)}</Tr>
                    </Thead>
                    <Tbody>
                        {
                            preparedData?.map((items, i) =>
                                <Tr key={i}>
                                    <Td>{i + 1}</Td>
                                    <Td>{items.barcodeNo}</Td>
                                    <Td>{items.itemCode}</Td>
                                    <Td>{items.itemDescription}</Td>
                                    <Td>{items.quantity}</Td>
                                    <Td>{moment(items.expiration).format("yyyy-MM-DD")}</Td>
                                    <Td>
                                        <Button
                                            onClick={() => cancelHandler(items.id)}
                                            size='xs' colorScheme='red'
                                        >
                                            Cancel
                                        </Button>
                                    </Td>
                                </Tr>
                            )
                        }
                    </Tbody>
                </Table>
            </PageScrollReusable>
            {
                isCancel && (
                    <CancelConfirmation
                        isOpen={isCancel}
                        onClose={closeCancel}
                        id={cancelId}
                        setCancelId={setCancelId}
                        fetchPreparedItems={fetchPreparedItems}
                        fetchOrderList={fetchOrderList}
                    />
                )
            }
        </VStack>
    )
}
