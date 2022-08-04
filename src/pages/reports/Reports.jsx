import React, { useState } from 'react'
import { Badge, Flex, HStack, Input, Select, VStack } from '@chakra-ui/react'
import { MiscellaneousIssueHistory } from './reportsdropdown/Miscellaneous-Issue-History'
import { MiscellaneousReceiptHistory } from './reportsdropdown/Miscellaneous-Receipt-History'
import { MoveOrderTransactionHistory } from './reportsdropdown/Move-Order-Transaction-History'
import { QCReceivingHistory } from './reportsdropdown/QC-Receiving-History'
import { SummaryofOrders } from './reportsdropdown/Summary-of-Orders'
import { TransformationReportHistory } from './reportsdropdown/Transformation-Report-History'
import { WarehouseReceivingHistory } from './reportsdropdown/Warehouse-Receiving-History'
import moment from 'moment'

const Reports = () => {

    const [dateFrom, setDateFrom] = useState(moment(new Date()).format('yyyy-MM-DD'))
    const [dateTo, setDateTo] = useState(moment(new Date()).format('yyyy-MM-DD'))

    const [sample, setSample] = useState('')

    return (
        <>
            <Flex w='full' p={5}>
                <Flex w='full' justifyContent='start' flexDirection='column'>
                    <Flex w='full' justifyContent='space-between'>
                        <Select
                            onChange={(e) => setSample(e.target.value)}
                            placeholder=' ' bgColor='#fff8dc' mt={6} w='19%'
                        >
                            <option value={1}>QC Receiving History</option>
                            <option value={2}>Warehouse Receiving History</option>
                            <option value={3}>Transformation Report History</option>
                            <option value={4}>Move Order Transaction History</option>
                            <option value={5}>Miscellaneous Issue History</option>
                            <option value={6}>Miscellaneous Receipt History</option>
                            {/* <option value={7}>Summary of Orders</option> */}
                        </Select>
                        <HStack>
                            <VStack>
                                <Badge>Date from</Badge>
                                <Input bgColor='#fff8dc' type='date' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                            </VStack>
                            <VStack>
                                <Badge>Date to</Badge>
                                <Input bgColor='#fff8dc' type='date' value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                            </VStack>
                        </HStack>
                    </Flex>

                    <Flex w='full' mt={5} justifyContent='center'>
                        {
                            sample == 1 ?
                                <QCReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                :
                                sample == 2 ?
                                    <WarehouseReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                    :
                                    sample == 3 ?
                                        <TransformationReportHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                        :
                                        sample == 4 ?
                                            <MoveOrderTransactionHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                            :
                                            sample == 5 ?
                                                <MiscellaneousIssueHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                                :
                                                sample == 6 ?
                                                    <MiscellaneousReceiptHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                                    : ''
                                                    // sample == 7 ?
                                                    //     <SummaryofOrders dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                                    //     : ''
                        }
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default Reports