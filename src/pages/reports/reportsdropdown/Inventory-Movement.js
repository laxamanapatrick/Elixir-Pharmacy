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
                        'AS OF QTY': item.ending,
                        'Purchase': item.totalIn,
                        'Usage(Out)': item.totalOut,
                        'Current QTY': item.currentStock
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
                                <Th color='white'>AS OF QTY</Th>
                                <Th color='white'>Purchase</Th>
                                <Th color='white'>{`Usage(Out)`}</Th>
                                <Th color='white'>Current QTY</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                movementData?.map((item, i) =>
                                    <Tr key={i}>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        <Td>{item.itemCategory}</Td>
                                        <Td>{item.ending}</Td>
                                        <Td>{item.totalIn}</Td>
                                        <Td>{item.totalOut}</Td>
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
