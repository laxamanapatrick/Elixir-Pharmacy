import { Flex, Select, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MiscellaneousIssueHistory } from './reportsdropdown/Miscellaneous-Issue-History'
import { MiscellaneousReceiptHistory } from './reportsdropdown/Miscellaneous-Receipt-History'
import { MoveOrderTransactionHistory } from './reportsdropdown/Move-Order-Transaction-History'
import { QCReceivingHistory } from './reportsdropdown/QC-Receiving-History'
import { SummaryofOrders } from './reportsdropdown/Summary-of-Orders'
import { TransformationReportHistory } from './reportsdropdown/Transformation-Report-History'
import { WarehouseReceivingHistory } from './reportsdropdown/Warehouse-Receiving-History'

const Reports = () => {

    const [sample, setSample] = useState('')

    return (
        <>
            <Flex w='full' p={5}>
                <Flex w='full' justifyContent='start' flexDirection='column'>
                    <Select
                        onChange={(e) => setSample(e.target.value)}
                        placeholder=' ' bgColor='#fff8dc' w='17%'
                    >
                        <option value={1}>QC Receiving History</option>
                        <option value={2}>Warehouse Receiving History</option>
                        <option value={3}>Transformation Report History</option>
                        <option value={4}>Move Order Transaction History</option>
                        <option value={5}>Miscellaneous Issue History</option>
                        <option value={6}>Miscellaneous Receipt History</option>
                        <option value={7}>Summary of Orders</option>
                    </Select>

                    <Flex w='full' mt={5} justifyContent='center'>
                        {
                            sample == 1 ?
                                <QCReceivingHistory />
                                :
                                sample == 2 ?
                                    <WarehouseReceivingHistory />
                                    :
                                    sample == 3 ?
                                        <TransformationReportHistory />
                                        :
                                        sample == 4 ?
                                            <MoveOrderTransactionHistory />
                                            :
                                            sample == 5 ?
                                                <MiscellaneousIssueHistory />
                                                :
                                                sample == 6 ?
                                                    <MiscellaneousReceiptHistory />
                                                    :
                                                    sample == 7 ?
                                                        <SummaryofOrders />
                                                        : ''
                        }
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default Reports