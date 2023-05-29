import React, { useState, useEffect } from 'react'
import { Button, Flex, HStack, Input, Select, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { ListofMoveOrder } from './transactmoveorder/List-of-Move-Order';
// import { MoveOrderInformation } from './transactmoveorder/Move-Order-Information';
// import { ListofMoveOrdersPerFarm } from './transactmoveorder/List-of-Move-Orders-PerFarm';
import apiClient from '../../services/apiClient'
import { TransactConfirmation } from './transactmoveorder/Action-Modals-Transact';
import moment from 'moment';

//Move Order List

const fetchMoveOrderListApi = async (status) => {
  const res = await apiClient.get(`Ordering/GetTotalListForMoveOrder?status=${status}`)
  return res.data
}

//Move Order Lists by Order No

const fetchMoveOrderListThirdTableApi = async (orderNo) => {
  const res = await apiClient.get(`Ordering/ListOfMoveOrdersForTransact?orderId=${orderNo}`)
  return res.data
}

//Transacted Move Orders


const TransactMoveOrderPage = ({ notification, fetchNotification }) => {

  const [status, setStatus] = useState(false)

  const [moveOrderList, setMoveOrderList] = useState([])
  const [moveOrderListThirdTable, setmoveOrderListThirdTable] = useState([])

  const [moveOrderInformation, setMoveOrderInformation] = useState({
    orderNo: '',
    deliveryStatus: '',
    farmName: '',
    farmCode: ''
  })
  const orderNo = moveOrderInformation.orderNo
  const [deliveryDate, setDeliveryDate] = useState('')

  const [checkedItems, setCheckedItems] = useState([])

  const { isOpen: isTransact, onClose: closeTransact, onOpen: openTransact } = useDisclosure()

  //Move Order List

  const fetchMoveOrderList = () => {
    fetchMoveOrderListApi(status).then(res => {
      setMoveOrderList(res)
    })
  }

  useEffect(() => {
    fetchMoveOrderList()

    return () => {
      setMoveOrderList([])
    }
  }, [status])

  //Move Order Lists by Order No

  const fetchMoveOrderListThirdTable = () => {
    fetchMoveOrderListThirdTableApi(orderNo).then(res => {
      setmoveOrderListThirdTable(res)
    })
  }

  useEffect(() => {
    if (orderNo) {
      fetchMoveOrderListThirdTable()
    }

    return () => {
      setmoveOrderListThirdTable([])
    }
  }, [orderNo])

  const newDate = new Date()
  const maxDate = moment(newDate).format('yyyy-MM-DD')
  const minDate = moment(newDate.setDate(newDate.getDate() - 7)).format('yyyy-MM-DD')

  return (
    <>
      <Flex w='full' justifyContent='space-between' flexDirection='column'>

        <Flex justifyContent='space-between' w='full'>
          <HStack justifyContent='space-between' mt={5} pl={5}>
            <Text>Status:</Text>
            <Select
              onChange={(e) => setStatus(Boolean(Number(e.target.value)))}
            >
              <option value={0}>For Transaction</option>
              <option value={1}>Transacted Orders</option>
            </Select>
          </HStack>
          {
            !status &&
            <HStack justifyContent='space-between' mt={5} pr={5}>
              <Text>Delivery Date:</Text>
              <Input
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={checkedItems?.length > 1 ? maxDate : minDate}
                max={maxDate}
                disabled={checkedItems <= 0}
                title={checkedItems <= 0 ? 'Please select items to transact first' : ''}
                type='date' bgColor='#fff8dc'
              />
            </HStack>
          }
        </Flex>

        <VStack p={5} w='full' spacing={0}>
          <ListofMoveOrder
            moveOrderList={moveOrderList}
            moveOrderInformation={moveOrderInformation} setMoveOrderInformation={setMoveOrderInformation}
            moveOrderListThirdTable={moveOrderListThirdTable}
            checkedItems={checkedItems} setCheckedItems={setCheckedItems}
            status={status}
          />
        </VStack>
        {
          !status &&
          <HStack justifyContent='end' mr={10} mt={5}>

            <Button
              onClick={() => openTransact()}
              title={!deliveryDate ? 'Please select a delivery date first' : ''}
              disabled={!deliveryDate}
              size='sm' colorScheme='blue'
            >
              Transact
            </Button>
          </HStack>
        }
      </Flex >
      {
        isTransact && (
          <TransactConfirmation
            isOpen={isTransact}
            onClose={closeTransact}
            deliveryDate={deliveryDate}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            fetchMoveOrderList={fetchMoveOrderList}
            setDeliveryDate={setDeliveryDate}
            fetchNotification={fetchNotification}
          />
        )
      }
    </>
  )
}

export default TransactMoveOrderPage;



//Old render




{/* {
          moveOrderInformation.orderNo &&
          <MoveOrderInformation
            moveOrderInformation={moveOrderInformation}
            deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate}
          />
        }
        {`
          moveOrderInformation.orderNo &&
          <ListofMoveOrdersPerFarm
            moveOrderListThirdTable={moveOrderListThirdTable}
            deliveryDate={deliveryDate}
            setMoveOrderInformation={setMoveOrderInformation}
            fetchMoveOrderList={fetchMoveOrderList}
          />
        } */}
{/* {
        moveOrderInformation.orderNo &&
        <Flex justifyContent='end' w='full'>
          <Button
            mr={5}
            onClick={() => setMoveOrderInformation({
              orderNo: '',
              deliveryStatus: '',
              farmName: ''
            })}
          >
            Back
          </Button>
        </Flex>
      } */}