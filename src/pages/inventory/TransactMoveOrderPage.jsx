import React, { useState, useEffect } from 'react'
import { Button, Flex, VStack } from '@chakra-ui/react'
import { ListofMoveOrder } from './transactmoveorder/List-of-Move-Order';
import { MoveOrderInformation } from './transactmoveorder/Move-Order-Information';
import { ListofMoveOrdersPerFarm } from './transactmoveorder/List-of-Move-Orders-PerFarm';
import apiClient from '../../services/apiClient'

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

  console.log(moveOrderList)

  return (
    <Flex w='full' justifyContent='space-between' flexDirection='column'>
      <VStack p={5} w='full' spacing={0}>
        <ListofMoveOrder
          moveOrderList={moveOrderList}
          moveOrderInformation={moveOrderInformation} setMoveOrderInformation={setMoveOrderInformation}
        />
        {
          moveOrderInformation.orderNo &&
          <MoveOrderInformation
            moveOrderInformation={moveOrderInformation}
            deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate}
          />
        }
        {
          moveOrderInformation.orderNo &&
          <ListofMoveOrdersPerFarm
            moveOrderListThirdTable={moveOrderListThirdTable}
            deliveryDate={deliveryDate}
            setMoveOrderInformation={setMoveOrderInformation}
            fetchMoveOrderList={fetchMoveOrderList}
          />
        }
      </VStack>
      {
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
      }
    </Flex>
  )
}

export default TransactMoveOrderPage;
