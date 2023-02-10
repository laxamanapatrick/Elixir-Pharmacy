import React, { useState } from 'react'
import moment from 'moment'
import * as XLSX from 'xlsx'
import { Badge, Button, Flex, HStack, Input, Select, Skeleton, Text, VStack } from '@chakra-ui/react'
import { MiscellaneousIssueHistory } from './reportsdropdown/Miscellaneous-Issue-History'
import { MiscellaneousReceiptHistory } from './reportsdropdown/Miscellaneous-Receipt-History'
import { MoveOrderTransactionHistory } from './reportsdropdown/Move-Order-Transaction-History'
import { QCReceivingHistory } from './reportsdropdown/QC-Receiving-History'
import { TransformationReportHistory } from './reportsdropdown/Transformation-Report-History'
import { WarehouseReceivingHistory } from './reportsdropdown/Warehouse-Receiving-History'
import { TransactedMoveOrders } from './reportsdropdown/Transacted-Move-Orders'
import { CancelledOrders } from './reportsdropdown/Cancelled-Orders'
import { NearlyExpiryReports } from './reportsdropdown/Nearly-Expiry-Reports'
import { InventoryMovement } from './reportsdropdown/Inventory-Movement'
import { TransformationReportHistoryTesting } from '../../sandbox/Transformation-Report-Testing'
import { TransformationReportHistoryTestingTwo } from '../../sandbox/Transformation-Report-TestingTwo'

const Reports = () => {

    const [dateFrom, setDateFrom] = useState(moment(new Date()).format('yyyy-MM-DD'))
    const [dateTo, setDateTo] = useState(moment(new Date()).format('yyyy-MM-DD'))
    const [expiryDays, setExpiryDays] = useState(30)

    const [sample, setSample] = useState('')
    const [sheetData, setSheetData] = useState([])

    const navigationHandler = (data) => {
        if (data) {
            setSample(data)
        } else {
            setSample('')
            setSheetData([])
        }
    }

    const handleExport = () => {
        var workbook = XLSX.utils.book_new(),
            worksheet = XLSX.utils.json_to_sheet(sheetData)

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

        XLSX.writeFile(workbook, "Elixir_Reports_ExportFile.xlsx")
    }

    const minimumDateForInventoryMovement = '2022-01-01'

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
                            <HStack>
                                <Select
                                    onChange={(e) => navigationHandler(Number(e.target.value))}
                                    placeholder=' ' bgColor='#fff8dc' w='full'
                                >
                                    <option value={1}>QC Receiving History</option>
                                    <option value={2}>Warehouse Receiving History</option>
                                    <option value={3}>Transformation Report History</option>
                                    <option value={4}>Move Order Transaction History</option>
                                    <option value={5}>Miscellaneous Issue History</option>
                                    <option value={6}>Miscellaneous Receipt History</option>
                                    <option value={7}>Transacted Move Orders</option>
                                    <option value={8}>Cancelled Orders</option>
                                    <option value={9}>Inventory Movement</option>
                                    <option value={10}>Nearly Expiry Report</option>
                                </Select>
                                <Button
                                    onClick={handleExport}
                                    disabled={sheetData?.length === 0 || !sample}
                                    size='xs'
                                >
                                    Export
                                </Button>
                            </HStack>
                        </Flex>

                        {/* Viewing Condition  */}
                        <Flex justifyContent='start'>
                            {
                                sample < 10 ?
                                    <Flex justifyContent='start' flexDirection='row'>
                                        {/* <Flex flexDirection='column' ml={1}>
                                            <Flex>
                                                <Badge>Status</Badge>
                                            </Flex>
                                            <Select
                                                onChange={(e) => setExpiryDays(e.target.value)}
                                                bgColor='#fff8dc' w='full'
                                            >
                                                <option value={30}>For Transaction</option>
                                                <option value={60}>Transacted</option>
                                            </Select>
                                        </Flex> */}
                                        {
                                            sample != 9 &&
                                            <Flex flexDirection='column' ml={1}>
                                                <Flex>
                                                    <Badge>Date from</Badge>
                                                </Flex>
                                                <Input bgColor='#fff8dc' type='date' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                            </Flex>
                                        }
                                        <Flex flexDirection='column' ml={1}>
                                            <Flex>
                                                <Badge>{sample === 9 ? 'Rollback Date' : 'Date to'}</Badge>
                                            </Flex>
                                            <Input bgColor='#fff8dc' type='date' value={dateTo} onChange={(e) => setDateTo(e.target.value)} min={sample === 9 ? minimumDateForInventoryMovement : undefined} />
                                        </Flex>
                                    </Flex>
                                    :
                                    sample === 10 &&
                                    <Flex justifyContent='start' flexDirection='column' ml={1}>
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
                                <QCReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                :
                                sample === 2 ?
                                    <WarehouseReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                    :
                                    sample === 3 ?
                                        <TransformationReportHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                        // <TransformationReportHistoryTestingTwo dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                        :
                                        sample === 4 ?
                                            <MoveOrderTransactionHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                            :
                                            sample === 5 ?
                                                <MiscellaneousIssueHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                                :
                                                sample === 6 ?
                                                    <MiscellaneousReceiptHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                                    : sample === 7 ?
                                                        <TransactedMoveOrders dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                                        : sample === 8 ?
                                                            <CancelledOrders sample={sample} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
                                                            : sample === 9 ?
                                                                <InventoryMovement dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
                                                                :
                                                                sample === 10 ?
                                                                    <NearlyExpiryReports sample={sample} expiryDays={expiryDays} setSheetData={setSheetData} />
                                                                    : ''
                        }
                    </Flex>

                </Flex>
            </Flex>
        </>
    )
}

export default Reports
