import React, { useState, useEffect } from 'react'
import {
  Button,
  ButtonGroup,
  Flex, HStack, Select,
  Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure
} from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { ApproveModal, RejectModal } from './Action-Modals'
import { TiInfo } from 'react-icons/ti'

export const ListofOrders = ({ farmOrders, orderId, setOrderId }) => {

  const [stockIdentifier, setStockIdentifier] = useState("false")

  const { isOpen: isApprove, onClose: closeApprove, onOpen: openApprove } = useDisclosure()
  const { isOpen: isReject, onClose: closeReject, onOpen: openReject } = useDisclosure()
  
  useEffect(() => {
    if(orderId) {
      farmOrders?.map(item => {
        if(item.quantityOrder > item.stockOnHand) {
          setStockIdentifier(true)
        } else {
          setStockIdentifier(false)
        }
      })
    }
  }, [orderId])

  const approveModal = () => {
    openApprove()
  }

  const rejectModal = () => {
    openReject()
  }

  const orderHandler = (id) => {
    if (id) {
      setOrderId(id)
    } else {
      setOrderId('')
    }
  }

  return (
    <Flex w='95%' p={10} flexDirection='column'>

      <Flex flexDirection='column'>
        <Text textAlign='center' bgColor='secondary' color='white'>List of Orders</Text>
        <PageScrollReusable minHeight='260px' maxHeight='270px'>
          <Table size='sm' variant='simple'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>Line</Th>
                <Th color='white'>Order Date</Th>
                <Th color='white'>Date Needed</Th>
                <Th color='white'>Farm</Th>
                <Th color='white'>Farm Code</Th>
                <Th color='white'>Category</Th>
                <Th color='white'>Item Code</Th>
                <Th color='white'>Item Description</Th>
                <Th color='white'>UOM</Th>
                <Th color='white'>Quantity Order</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                farmOrders?.map((item, i) =>
                  <Tr
                    onClick={() => orderHandler(item.id)}
                    bgColor={orderId === item.id ? 'table_accent' : 'none'}
                    key={i} cursor='pointer'
                  >
                    {
                      item.quantityOrder > item.stockOnHand ?
                        <Td><TiInfo color='red' fontSize='18px' /></Td>
                        :
                        <Td>{i + 1}</Td>
                    }
                    <Td>{item.orderDate}</Td>
                    <Td>{item.dateNeeded}</Td>
                    <Td>{item.farm}</Td>
                    <Td>{item.farmCode}</Td>
                    <Td>{item.category}</Td>
                    <Td>{item.itemCode}</Td>
                    <Td>{item.itemDescription}</Td>
                    <Td>{item.uom}</Td>
                    <Td>{item.quantityOrder}</Td>
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScrollReusable>
      </Flex>

      <Flex justifyContent='end'>
        <ButtonGroup size='xs'>
          <Button colorScheme='blue' px={2} disabled={!orderId || stockIdentifier} onClick={approveModal}>APPROVE</Button>
          <Button colorScheme='red' px={4} disabled={!orderId} onClick={rejectModal}>REJECT</Button>
        </ButtonGroup>
      </Flex>

      {
        isApprove && (
          <ApproveModal
            isOpen={isApprove}
            onClose={closeApprove}
          />
        )
      }

      {
        isReject && (
          <RejectModal
            isOpen={isReject}
            onClose={closeReject}
          />
        )
      }

    </Flex >
  )
}
