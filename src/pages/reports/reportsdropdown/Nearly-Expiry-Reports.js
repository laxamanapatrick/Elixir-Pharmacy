import React, { useEffect, useState } from 'react'
import { Button, Flex, HStack, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchNearlyExpireReportsApi = async (expiryDays) => {
    const res = await apiClient.get(`Report/NearlyExpireItemsReport?expirydays=${expiryDays}`)
    return res.data
}

export const NearlyExpiryReports = ({ expiryDays }) => {

    const [nearlyExpireData, setNearlyExpireData] = useState([])
    // const [buttonChanger, setButtonChanger] = useState(true)

    const fetchNearlyExpireReports = () => {
        fetchNearlyExpireReportsApi(expiryDays).then(res => {
            setNearlyExpireData(res)
        })
    }

    useEffect(() => {
        fetchNearlyExpireReports()

        return () => {
            setNearlyExpireData([])
        }
    }, [expiryDays])

    return (
        <Flex w='full' flexDirection='column'>
            <Flex border='1px'>
                <PageScrollReusable minHeight='800px' maxHeight='820px'>
                    <Table size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Warehouse Id</Th>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                {/* {
                                    buttonChanger ?
                                        <> */}
                                <Th color='white'>UOM</Th>
                                <Th color='white'>Quantity</Th>
                                <Th color='white'>Supplier</Th>
                                <Th color='white'>Received Date</Th>
                                {/* </>
                                        :
                                        <> */}
                                <Th color='white'>Manufacturing Date</Th>
                                <Th color='white'>Expiration Date</Th>
                                <Th color='white'>Expiration Days</Th>
                                <Th color='white'>Received By</Th>
                                {/* </>
                                } */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                nearlyExpireData?.map((item, i) =>
                                    <Tr key={i}>
                                        <Td>{item.warehouseId}</Td>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        {/* {
                                            buttonChanger
                                                ?
                                                <> */}
                                        <Td>{item.uom}</Td>
                                        <Td>{item.quantity}</Td>
                                        <Td>{item.supplierName}</Td>
                                        <Td>{item.receiveDate}</Td>
                                        {/* </>
                                                :
                                                <> */}
                                        <Td>{item.manufacturingDate}</Td>
                                        <Td>{item.expirationDate}</Td>
                                        <Td>{item.expirationDays}</Td>
                                        <Td>{item.receivedBy}</Td>
                                        {/* </>
                                        } */}
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
