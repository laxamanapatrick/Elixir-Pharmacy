import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchInventoryMovementApi = async (dateFrom, dateTo) => {
    const res = await apiClient.get(`Report/InventoryMovementReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
    return res.data
}

export const InventoryMovement = ({ dateFrom, dateTo, setSheetData }) => {

    const [movementData, setMovementData] = useState([])
    // const [buttonChanger, setButtonChanger] = useState(true)

    const fetchInventoryMovement = () => {
        fetchInventoryMovementApi(dateFrom, dateTo).then(res => {
            setMovementData(res)
            setSheetData(
                res?.map((item, i) => {
                    return {
                        'Line Number': i + 1,
                        'Item Code': item.itemCode,
                        'Item Description': item.itemDescription,
                        'Category': item.itemCategory,
                        'Total Out': item.totalOut,
                        'Total IN': item.totalIn,
                        'Ending': item.ending,
                        'Current SOH': item.currentStock
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
    }, [dateFrom, dateTo])

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
                                <Th color='white'>Total Out</Th>
                                <Th color='white'>Total IN</Th>
                                <Th color='white'>Ending</Th>
                                <Th color='white'>Current SOH</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                movementData?.map((item, i) =>
                                    <Tr key={i}>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        <Td>{item.itemCategory}</Td>
                                        <Td>{item.totalOut}</Td>
                                        <Td>{item.totalIn}</Td>
                                        <Td>{item.ending}</Td>
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
