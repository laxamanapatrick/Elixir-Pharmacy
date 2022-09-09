import React, { useEffect, useState } from 'react'
import { Button, Flex, HStack, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchQCReceivingHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/QcReceivingReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const QCReceivingHistory = ({ dateFrom, dateTo, sample, setSheetData }) => {

  const [qcData, setQcData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(1)

  const fetchQCReceivingHistory = () => {
    fetchQCReceivingHistoryApi(dateFrom, dateTo, sample).then(res => {
      setQcData(res)
      setSheetData(res)
    })
  }

  useEffect(() => {
    fetchQCReceivingHistory()

    return () => {
      setQcData([])
    }
  }, [dateFrom, dateTo, sample])

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px'>
        <PageScrollReusable minHeight='800px' maxHeight='820px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>ID</Th>
                <Th color='white'>QC Date</Th>
                <Th color='white'>PO Number</Th>
                {
                  buttonChanger === 1 ?
                    <>
                      <Th color='white'>Item Code</Th>
                      <Th color='white'>Item Description</Th>
                      <Th color='white'>UOM</Th>
                      <Th color='white'>Category</Th>
                      <Th color='white'>Quantity</Th>
                      <Th color='white'>Manufacturing Date</Th>
                    </>
                    : buttonChanger === 2 ?
                      <>
                        <Th color='white'>Expiration</Th>
                        <Th color='white'>Total Reject</Th>
                        <Th color='white'>Supplier Name</Th>
                        <Th color='white'>Price</Th>
                        {/* <Th color='white'>checklist_result</Th> */}
                        <Th color='white'>qc_by</Th>
                      </>
                      : buttonChanger === 3 ?
                        <>
                          <Th color='white'>Covered and Closed</Th>
                          <Th color='white'>Truck Remarks(1)</Th>
                          <Th color='white'>Dry and Clean</Th>
                          <Th color='white'>Truck Remarks(2)</Th>
                          <Th color='white'>No waste</Th>
                          <Th color='white'>Truck Remarks(3)</Th>
                          <Th color='white'>No insect/rodent activity</Th>
                          <Th color='white'>Truck Remarks(4)</Th>
                        </>
                        : buttonChanger === 4 ?
                          <>
                            <Th color='white'>On clean pallets</Th>
                            <Th color='white'>Unloading Remarks(1)</Th>
                            <Th color='white'>No Damaged Packaging</Th>
                            <Th color='white'>Unloading Remarks(2)</Th>
                            <Th color='white'>Clean package</Th>
                            <Th color='white'>Unloading Remarks(3)</Th>
                            <Th color='white'>Certificate of Analysis</Th>
                            <Th color='white'>Unloading Remarks(4)</Th>
                          </>
                          : buttonChanger === 5 &&
                          <>
                            <Th color='white'>Accurate raw materials</Th>
                            <Th color='white'>Checking Remarks(1)</Th>
                            <Th color='white'>No foreign materials</Th>
                            <Th color='white'>Checking Remarks(2)</Th>
                          </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                qcData?.map((item, i) =>
                  <Tr key={i}>
                    <Td>{item.id}</Td>
                    <Td>{item.qcDate}</Td>
                    <Td>{item.poNumber}</Td>
                    {
                      buttonChanger === 1 ?
                        <>
                          <Td>{item.itemCode}</Td>
                          <Td>{item.itemDescription}</Td>
                          <Td>{item.uom}</Td>
                          <Td>{item.category}</Td>
                          <Td>{item.quantity}</Td>
                          <Td>{item.manufacturingDate}</Td>
                        </>
                        : buttonChanger === 2 ?
                          <>
                            <Td>{item.expirationDate}</Td>
                            <Td>{item.totalReject}</Td>
                            <Td>{item.supplierName}</Td>
                            <Td>{item.price}</Td>
                            {/* <Td>{`No data`}</Td> */}
                            <Td>{item.qcBy}</Td>
                          </>
                          : buttonChanger === 3 ?
                            <>
                              <Td>{item.truckApproval1 ? 'Yes' : 'No'}</Td>
                              <Td>{item.truckApprovalRemarks1 ? item.truckApprovalRemarks1 : 'None'}</Td>
                              <Td>{item.truckApproval2 ? 'Yes' : 'No'}</Td>
                              <Td>{item.truckApprovalRemarks2 ? item.truckApprovalRemarks2 : 'None'}</Td>
                              <Td>{item.truckApproval3 ? 'Yes' : 'No'}</Td>
                              <Td>{item.truckApprovalRemarks3 ? item.truckApprovalRemarks3 : 'None'}</Td>
                              <Td>{item.truckApproval4 ? 'Yes' : 'No'}</Td>
                              <Td>{item.truckApprovalRemarks4 ? item.truckApprovalRemarks4 : 'None'}</Td>
                            </>
                            : buttonChanger === 4 ?
                              <>
                                <Td>{item.unloadingApproval1 ? 'Yes' : 'No'}</Td>
                                <Td>{item.unloadingApprovalRemarks1 ? item.unloadingApprovalRemarks1 : 'None'}</Td>
                                <Td>{item.unloadingApproval2 ? 'Yes' : 'No'}</Td>
                                <Td>{item.unloadingApprovalRemarks2 ? item.unloadingApprovalRemarks2 : 'None'}</Td>
                                <Td>{item.unloadingApproval3 ? 'Yes' : 'No'}</Td>
                                <Td>{item.unloadingApprovalRemarks3 ? item.unloadingApprovalRemarks3 : 'None'}</Td>
                                <Td>{item.unloadingApproval4 ? 'Yes' : 'No'}</Td>
                                <Td>{item.unloadingApprovalRemarks4 ? item.unloadingApprovalRemarks4 : 'None'}</Td>
                              </>
                              : buttonChanger === 5 &&
                              <>
                                <Td>{item.checkingApproval1 ? 'Yes' : 'No'}</Td>
                                <Td>{item.checkingApprovalRemarks1 ? item.checkingApprovalRemarks1 : 'None'}</Td>
                                <Td>{item.checkingApproval2 ? 'Yes' : 'No'}</Td>
                                <Td>{item.checkingApprovalRemarks2 ? item.checkingApprovalRemarks2 : 'None'}</Td>
                              </>
                    }
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScrollReusable>
      </Flex>

      <HStack justifyContent='end' mt={2} spacing={1}>
        <Button size='xs' colorScheme='teal' disabled={buttonChanger === 1} onClick={() => setButtonChanger(buttonChanger - 1)}>
          {`<<<<`}
        </Button>
        <Button size='xs' colorScheme='teal' disabled={buttonChanger === 5} onClick={() => setButtonChanger(buttonChanger + 1)}>
          {`>>>>`}
        </Button>
      </HStack>
    </Flex>
  )
}
