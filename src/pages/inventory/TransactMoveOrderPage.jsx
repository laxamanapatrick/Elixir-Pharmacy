import React, { useState, useEffect } from 'react'
import { Button, Flex, HStack, Input, useDisclosure, VStack } from '@chakra-ui/react'
import { ListofMoveOrder } from './transactmoveorder/List-of-Move-Order';
// import { MoveOrderInformation } from './transactmoveorder/Move-Order-Information';
// import { ListofMoveOrdersPerFarm } from './transactmoveorder/List-of-Move-Orders-PerFarm';
import apiClient from '../../services/apiClient'
import { TransactConfirmation } from './transactmoveorder/Action-Modals-Transact';

//Move Order List

const fetchMoveOrderListApi = async () => {
  const res = await apiClient.get(`Ordering/GetTotalListForMoveOrder`)
  return res.data
}

//Move Order Lists by Order No

const fetchMoveOrderListThirdTableApi = async (orderNo) => {
  const res = await apiClient.get(`Ordering/ListOfMoveOrdersForTransact?orderId=${orderNo}`)
  return res.data
}

const TransactMoveOrderPage = () => {

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
    fetchMoveOrderListApi().then(res => {
      setMoveOrderList(res)
    })
  }

  useEffect(() => {
    fetchMoveOrderList()

    return () => {
      setMoveOrderList([])
    }
  }, [])

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

  return (
    <>
      <Flex w='full' justifyContent='space-between' flexDirection='column'>
        <VStack p={5} w='full' spacing={0}>
          <ListofMoveOrder
            moveOrderList={moveOrderList}
            moveOrderInformation={moveOrderInformation} setMoveOrderInformation={setMoveOrderInformation}
            moveOrderListThirdTable={moveOrderListThirdTable}
            checkedItems={checkedItems} setCheckedItems={setCheckedItems}
          />
        </VStack>
        <HStack justifyContent='end' mr={10} mt={5}>
          <Input
            onChange={(e) => setDeliveryDate(e.target.value)}
            disabled={checkedItems <= 0}
            title={checkedItems <= 0 ? 'Please select items to transact first' : ''}
            w='13%' type='date' bgColor='#fff8dc'
          />
          <Button
            onClick={() => openTransact()}
            title={!deliveryDate ? 'Please select a delivery date first' : ''}
            disabled={!deliveryDate}
            size='sm' colorScheme='blue'
          >
            Transact
          </Button>
        </HStack>
      </Flex>
      {
        isTransact && (
          <TransactConfirmation
            isOpen={isTransact}
            onClose={closeTransact}
            deliveryDate={deliveryDate}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            fetchMoveOrderList={fetchMoveOrderList}
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