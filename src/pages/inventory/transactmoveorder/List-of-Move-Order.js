import React from 'react'
import { Button, Checkbox, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'
import { GrRadialSelected } from 'react-icons/gr'
import { ViewModal } from './Action-Modals-Transact'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const ListofMoveOrder = ({ moveOrderList, setMoveOrderInformation, moveOrderInformation, moveOrderListThirdTable, checkedItems, setCheckedItems }) => {

  const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure()

  // const TableHead = [
  //   "Line", "Order Id", "Farm", "Farm Code", "Category", "Total Quantity Order", "Order Date", "Date Needed", "Prepared Date", "View"
  // ]

  // const setterHandler = ({ orderNo, deliveryStatus, farm, farmCode }) => {
  //   // Add delivery status for condition
  //   if (orderNo && farm && farmCode) {
  //     setMoveOrderInformation({
  //       orderNo: orderNo,
  //       deliveryStatus: deliveryStatus,
  //       farmName: farm,
  //       farmCode: farmCode
  //     })
  //   } else {
  //     setMoveOrderInformation({
  //       orderNo: '',
  //       deliveryStatus: '',
  //       farmName: '',
  //       farmCode: ''
  //     })
  //   }
  // }

  const viewHandler = ({ orderNo, deliveryStatus, farm, farmCode }) => {
    // Add delivery status for condition
    if (orderNo && farm && farmCode) {
      setMoveOrderInformation({
        orderNo: orderNo,
        deliveryStatus: deliveryStatus,
        farmName: farm,
        farmCode: farmCode
      })
      openView()
    } else {
      setMoveOrderInformation({
        orderNo: '',
        deliveryStatus: '',
        farmName: '',
        farmCode: ''
      })
    }
  }

  const moveOrderData = moveOrderList?.filter(item => item.stockOnHand >= item.quantityOrder)
  const submitData = moveOrderData?.map(item => {
    return {
      orderNo: item.orderNo,
      farmType: item.farmType,
      farmName: item.farm,
      farmCode: item.farmCode,
      orderNoPKey: item.orderNoPKey,
      isApprove: item.isApproved,
      preparedBy: currentUser?.userName
    }
  })

  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(submitData)
    } else {
      setCheckedItems([])
    }
  }

  const childCheckHandler = (e) => {
    const data = JSON.parse(e.target.value)
    let valueSubmit = {
      orderNo: data.orderNo,
      farmType: data.farmType,
      farmName: data.farm,
      farmCode: data.farmCode,
      orderNoPKey: data.orderNoPKey,
      isApprove: data.isApproved,
      preparedBy: currentUser?.userName
    }
    if (e.target.checked) {
      setCheckedItems([...checkedItems, valueSubmit])
    } else {
      const filterData = checkedItems?.filter(item => item.orderNo !== valueSubmit.orderNo)
      setCheckedItems(filterData)
    }
    // if (orderNo && farmType && farm && farmCode && orderNoPKey && isApproved) {
    //   setCheckedItems([...checkedItems, valueSubmit])
    // } else {
    //   const data = checkedItems?.filter(item => item !== valueSubmit)
    //   setCheckedItems(data)
    // }
  }

  return (
    <>
      <Flex w='full' flexDirection='column'>
        <VStack spacing={0}>
          <Text pb={2} textAlign='center' fontSize='md' color='white' bgColor='secondary' w='full' mb={-1.5}>List of Move Order</Text>
          <PageScrollReusable minHeight='770px' maxHeight='790px'>
            <Table size='sm' variant='simple'>
              <Thead bgColor='secondary'>
                <Tr>
                  <Th color='white'>
                    <Checkbox
                      onChange={parentCheckHandler}
                      isChecked={
                        submitData?.length === checkedItems?.length
                      }
                      color='white'
                    >
                      Line
                    </Checkbox>
                  </Th>
                  <Th color='white'>Order Id</Th>
                  <Th color='white'>Customer Code</Th>
                  <Th color='white'>Customer Name</Th>
                  <Th color='white'>Category</Th>
                  <Th color='white'>Total Quantity Order</Th>
                  <Th color='white'>Order Date</Th>
                  <Th color='white'>Date Needed</Th>
                  <Th color='white'>Prepared Date</Th>
                  <Th color='white'>View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  moveOrderList?.map((list, i) =>
                    <Tr key={i}
                      // onClick={() => setterHandler(list)}
                      // bgColor={moveOrderInformation.orderNo === list.orderNo ? 'table_accent' : 'none'}
                      cursor='pointer'
                    >
                      {/* {
                        moveOrderInformation.orderNo === list.orderNo ?
                          <Td><GrRadialSelected /></Td>
                          :
                          ''
                      } */}
                      <Td>
                        <Checkbox
                          // onChange={() => childCheckHandler(list)}
                          onChange={childCheckHandler}
                          isChecked={checkedItems.some(item => item.orderNo === list.orderNo)}
                          value={JSON.stringify(list)}
                          color='black'
                        >
                          {i + 1}
                        </Checkbox>
                      </Td>
                      <Td>{list.orderNo}</Td>
                      <Td>{list.farmCode}</Td>
                      <Td>{list.farm}</Td>
                      <Td>{list.category}</Td>
                      <Td>{list.totalOrders}</Td>
                      <Td>{list.orderDate}</Td>
                      <Td>{list.dateNeeded}</Td>
                      <Td>{moment(list.preparedDate).format('MM/DD/yyyy')}</Td>
                      <Td>
                        <Button size='xs' colorScheme='green' onClick={() => viewHandler(list)}>
                          View
                        </Button>
                      </Td>
                    </Tr>
                  )
                }
              </Tbody>
            </Table>
          </PageScrollReusable>
        </VStack>
      </Flex>
      {
        isView && (
          <ViewModal
            isOpen={isView}
            onClose={closeView}
            moveOrderInformation={moveOrderInformation}
            moveOrderListThirdTable={moveOrderListThirdTable}
          />
        )
      }
    </>
  )
}
