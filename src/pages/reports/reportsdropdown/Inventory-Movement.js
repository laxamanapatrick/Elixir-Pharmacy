import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment/moment'

// const fetchInventoryMovementApi = async (dateFrom, dateTo) => {
const fetchInventoryMovementApi = async (dateTo) => {
    // const res = await apiClient.get(`Report/InventoryMovementReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
    const dateToPlus = new Date(dateTo)
    const plusOne = moment(dateToPlus.setDate(dateToPlus.getDate() + 1)).format('yyyy-MM-DD')
    const res = await apiClient.get(`Report/InventoryMovementReport?dateFrom=2022-01-01&dateTo=${dateTo}&plusOne=${plusOne}`)
    return res.data
}

// export const InventoryMovement = ({ dateFrom, dateTo, setSheetData }) => {
export const InventoryMovement = ({ dateTo, setSheetData }) => {

    const [movementData, setMovementData] = useState([])
    // const [buttonChanger, setButtonChanger] = useState(true)

    const fetchInventoryMovement = () => {
        // fetchInventoryMovementApi(dateFrom, dateTo).then(res => {
        fetchInventoryMovementApi(dateTo).then(res => {
            setMovementData(res)
            setSheetData(
                res?.map((item, i) => {
                    return {
                        // 'Line Number': i + 1,
                        'Item Code': item.itemCode,
                        'Item Description': item.itemDescription,
                        'Item Category': item.itemCategory,
                        'Ending IN': item.totalIn,
                        'Ending Out': item.totalOut,
                        'Ending': item.ending,
                        'Purchased Order': item.purchasedOrder,
                        'Others': item.othersPlus,
                        'Current Stock': item.currentStock
                    }
                })
            )
        })
    }

    useEffect(() => {
        fetchInventoryMovement()

        return () => {
            setMovementData([])
        }
        // }, [dateFrom, dateTo])
    }, [dateTo])

    return (
        <Flex w='full' flexDirection='column'>
            <Flex border='1px'>
                <PageScrollReusable minHeight='800px' maxHeight='820px'>
                    <Table size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                <Th color='white'>Category</Th>
                                <Th color='white'>{`Ending (IN)`}</Th>
                                <Th color='white'>{`Ending (OUT)`}</Th>
                                <Th color='white'>Ending</Th>
                                <Th color='white'>Purchased Order</Th>
                                <Th color='white'>Others</Th>
                                <Th color='white'>Current Stock</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                movementData?.map((item, i) =>
                                    <Tr key={i}>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        <Td>{item.itemCategory}</Td>
                                        <Td>{item.totalIn}</Td>
                                        <Td>{item.totalOut}</Td>
                                        <Td>{item.ending}</Td>
                                        <Td>{item.purchasedOrder}</Td>
                                        <Td>{item.othersPlus}</Td>
                                        <Td>{item.currentStock}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>

            {/* <Flex justifyContent='end' mt={2}>
        <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex> */}
        </Flex>
    )
}
