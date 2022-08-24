import React, { useState } from 'react'
import { Badge, Flex, Input, Select } from '@chakra-ui/react'
import { MiscellaneousIssueHistory } from './reportsdropdown/Miscellaneous-Issue-History'
import { MiscellaneousReceiptHistory } from './reportsdropdown/Miscellaneous-Receipt-History'
import { MoveOrderTransactionHistory } from './reportsdropdown/Move-Order-Transaction-History'
import { QCReceivingHistory } from './reportsdropdown/QC-Receiving-History'
import { TransformationReportHistory } from './reportsdropdown/Transformation-Report-History'
import { WarehouseReceivingHistory } from './reportsdropdown/Warehouse-Receiving-History'
import moment from 'moment'
import { NearlyExpiryReports } from './reportsdropdown/Nearly-Expiry-Reports'
import { TransactedMoveOrders } from './reportsdropdown/Transacted-Move-Orders'

const Reports = () => {

    const [dateFrom, setDateFrom] = useState(moment(new Date()).format('yyyy-MM-DD'))
    const [dateTo, setDateTo] = useState(moment(new Date()).format('yyyy-MM-DD'))
    const [expiryDays, setExpiryDays] = useState(30)

    const [sample, setSample] = useState('')

    return (
        <>
            <Flex w='full' p={5}>
                <Flex w='full' justifyContent='start' flexDirection='column'>

                    <Flex w='full' justifyContent='space-between'>
                        {/* Dropdown value  */}
                        <Flex justifyContent='start' flexDirection='column'>
                            <Flex>
                                <Badge>Report Name</Badge>
                            </Flex>
                            <Select
                                onChange={(e) => setSample(Number(e.target.value))}
                                placeholder=' ' bgColor='#fff8dc' w='full'
                            >
                                <option value={1}>QC Receiving History</option>
                                <option value={2}>Warehouse Receiving History</option>
                                <option value={3}>Transformation Report History</option>
                                <option value={4}>Move Order Transaction History</option>
                                <option value={5}>Miscellaneous Issue History</option>
                                <option value={6}>Miscellaneous Receipt History</option>
                                <option value={7}>Transacted Move Orders</option>
                                <option value={8}>Nearly Expiry Report</option>
                            </Select>
                        </Flex>

                        {/* Viewing Condition  */}
                        <Flex justifyContent='start'>
                            {
                                sample < 8 ?
                                    <Flex justifyContent='start' flexDirection='row'>
                                        <Flex flexDirection='column'>
                                            <Flex>
                                                <Badge>Date from</Badge>
                                            </Flex>
                                            <Input bgColor='#fff8dc' type='date' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                        </Flex>
                                        <Flex flexDirection='column'>
                                            <Flex>
                                                <Badge>Date to</Badge>
                                            </Flex>
                                            <Input bgColor='#fff8dc' type='date' value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                        </Flex>
                                    </Flex>
                                    :
                                    sample === 8 &&
                                    <Flex justifyContent='start' flexDirection='column'>
                                        <Flex>
                                            <Badge>Expiry Days</Badge>
                                        </Flex>
                                        <Select
                                            onChange={(e) => setExpiryDays(e.target.value)}
                                            bgColor='#fff8dc' w='full'
                                        >
                                            <option value={30}>30</option>
                                            <option value={60}>60</option>
                                            <option value={90}>90</option>
                                        </Select>
                                    </Flex>
                            }
                        </Flex>
                    </Flex>

                    {/* Rendering Reports Components  */}
                    <Flex w='full' mt={5} justifyContent='center'>
                        {
                            sample === 1 ?
                                <QCReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                :
                                sample === 2 ?
                                    <WarehouseReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                    :
                                    sample === 3 ?
                                        <TransformationReportHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                        :
                                        sample === 4 ?
                                            <MoveOrderTransactionHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                            :
                                            sample === 5 ?
                                                <MiscellaneousIssueHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                                :
                                                sample === 6 ?
                                                    <MiscellaneousReceiptHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                                    : sample === 7 ?
                                                        <TransactedMoveOrders dateFrom={dateFrom} dateTo={dateTo} sample={sample} />
                                                        : sample === 8 ?
                                                            <NearlyExpiryReports sample={sample} expiryDays={expiryDays} />
                                                            : ''
                        }
                    </Flex>

                </Flex>
            </Flex>
        </>
    )
}

export default Reports
