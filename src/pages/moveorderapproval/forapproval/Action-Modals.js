import React, { useState, useEffect, useRef } from 'react'
import { HStack, Image, Button, ButtonGroup, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Table, Tbody, Td, Text, Th, Thead, toast, Tr, useDisclosure, useToast, VStack, Box } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'
import { PrintModal } from '../approvedmo/Action-Modals'
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

const currentUser = decodeUser()

export const ViewModal = ({ isOpen, onClose, viewData }) => {

  const TableHeads = [
    "Line", "Barcode", "Item Code", "Item Description", "Quantity", "Expiration Date"
  ]

  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='4xl'>
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='center'>
            <Text>View Modal</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <Flex justifyContent='center'>
            <PageScrollReusable minHeight='300px' maxHeight='450px'>
              <Table size='sm'>
                <Thead bgColor='secondary'>
                  <Tr>{TableHeads?.map((item, i) => <Th key={i} color='white'>{item}</Th>)}</Tr>
                </Thead>
                <Tbody>
                  {
                    viewData?.map((item, i) =>
                      <Tr key={i}>
                        <Td>{i + 1}</Td>
                        <Td>{item.barcodeNo}</Td>
                        <Td>{item.itemCode}</Td>
                        <Td>{item.itemDescription}</Td>
                        <Td>{item.quantity}</Td>
                        <Td>{moment(item.expiration).format("MM/DD/yyyy")}</Td>
                      </Tr>
                    )
                  }
                </Tbody>
              </Table>
            </PageScrollReusable>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size='sm' mt={7}>
            <Button colorScheme='gray' onClick={onClose}>Close</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const ApproveModal = ({ isOpen, onClose, orderNo, fetchForApprovalMO, printData, fetchNotification }) => {

  const [isLoading, setIsLoading] = useState(false)

  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const dateToday = new Date()

  const toast = useToast()
  const { isOpen: isPrint, onClose: closePrint, onOpen: openPrint } = useDisclosure()

  const submitHandler = () => {
    setIsLoading(true)
    try {
      const res = apiClient.put(`Ordering/ApproveListOfMoveOrder`, { orderNo: orderNo })
        .then(res => {
          ToastComponent("Success", "Move order has been approved", "success", toast)
          fetchNotification()
          fetchForApprovalMO()
          try {
            const res = apiClient.put(`Ordering/UpdatePrintStatus`, { orderNo: orderNo })
              .then(res => {
                setIsLoading(false)
                handlePrint()
                openPrint()
              })
              .catch(err => { })
          } catch (error) {
          }
        })
        .catch(jaypee => {
          ToastComponent("Error", "Move order was not approved", "error", toast)
          setIsLoading(false)
        })
    } catch (error) {
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent='center'>
              <Text>Approve Modal </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent='center'>
              <Text>Are you sure you want to approve this move order?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup size='sm' mt={7}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme='blue'
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme='red'
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {
        isPrint && (
          <PrintModal
            isOpen={isPrint}
            onClose={closePrint}
            closeApprove={onClose}
            printData={printData}
            fetchApprovedMO={fetchForApprovalMO}
            orderId={orderNo}
          />
        )
      }
      <Box display='none'>
        <Flex w='full' mt={8} p={5} flexDirection='column' ref={componentRef}>

          <Flex spacing={0} justifyContent='start' flexDirection='column'>
            <Image
              src='/images/RDF Logo.png'
              w='13%' ml={3}
            />
            <Text fontSize='8px' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
          </Flex>

          <Flex justifyContent='center' my={4}>
            <Text fontSize='lg' fontWeight='semibold'>Move Order Slip</Text>
          </Flex>

          <Flex justifyContent='space-between' mb={3}>
            <Flex flexDirection='column'>
              <Text>Order ID: {orderNo && orderNo}</Text>
              <Text>Warehouse: {`Pharmacy`}</Text>
              <Text>Customer: {printData[0]?.farmName}</Text>
              <Text>Address: {printData[0]?.farmName}</Text>
            </Flex>
            <Flex flexDirection='column'>
              <Barcode width={3} height={50} value={Number(orderNo)} />
              <Text>Date: {moment(dateToday).format("MM/DD/yyyy")}</Text>
            </Flex>
          </Flex>

          <PageScrollReusable minHeight='150px' maxHeight='300px'>
            <Table size='sm'>
              <Thead bgColor='secondary'>
                <Tr>
                  <Th color='white'>ITEM CODE</Th>
                  <Th color='white'>ITEM DESCRIPTION</Th>
                  <Th color='white'>UOM</Th>
                  <Th color='white'>QUANTITY</Th>
                  <Th color='white'>ACTUAL QTY RECEIVED</Th>
                  <Th color='white'>EXPIRATION DATE</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  printData?.map((item, i) =>
                    <Tr key={i}>
                      <Td>{item.itemCode}</Td>
                      <Td>{item.itemDescription}</Td>
                      <Td>{item.uom}</Td>
                      <Td>{item.quantity}</Td>
                      <Td></Td>
                      <Td>{moment(item.expiration).format("MM/DD/yyyy")}</Td>
                    </Tr>
                  )
                }
              </Tbody>
            </Table>
          </PageScrollReusable>

          <Flex justifyContent='space-between' mb={5}>
            <HStack>
              <Text>Delivery Status:</Text>
              <Text textDecoration='underline'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {printData[0]?.deliveryStatus}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Text>
            </HStack>
            <VStack spacing={0}>
              <HStack>
                <Text>Checked By:</Text>
                <Text textDecoration='underline'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
              {/* <Text>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Patrick Laxamana
              </Text> */}
            </VStack>
          </Flex>

          <Flex justifyContent='space-between'>
            <VStack spacing={0}>
              <HStack>
                <Text>Prepared By:</Text>
                <Text textDecoration='underline'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
              {/* <Text>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Patrick Laxamana
              </Text> */}
            </VStack>
            <VStack spacing={0}>
              <HStack>
                <Text>Received By:</Text>
                <Text textDecoration='underline'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
              {/* <Text>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Jaypee Obidos
              </Text> */}
            </VStack>
          </Flex>

        </Flex>
      </Box>
    </>
  )
}

export const RejectModal = ({ isOpen, onClose, id, fetchForApprovalMO, fetchNotification }) => {

  const [reasonSubmit, setReasonSubmit] = useState('')

  const [reasons, setReasons] = useState([])

  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const fetchReasonsApi = async () => {
    const res = await apiClient.get(`Reason/GetAllActiveReason`)
    return res.data
  }

  const fetchReasons = () => {
    fetchReasonsApi().then(res => {
      setReasons(res)
    })
  }

  useEffect(() => {
    fetchReasons()

    return () => {
      setReasons([])
    }
  }, [])

  const submitHandler = () => {
    setIsLoading(true)
    try {
      const res = apiClient.put(`Ordering/RejectListOfMoveOrder`,
        {
          orderNo: id,
          remarks: reasonSubmit,
          rejectBy: currentUser?.userName
        }
      )
        .then(res => {
          ToastComponent("Success", "Move order has been rejected", "success", toast)
          fetchNotification()
          fetchForApprovalMO()
          setIsLoading(false)
          onClose()
        })
        .catch(err => {
          ToastComponent("Error", "Move order was not rejected", "error", toast)
          setIsLoading(false)
        })
    } catch (error) {
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='center'>
            <Text>Reject</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent='center'>
            <Text>Are you sure you want to reject this move order?</Text>
            {
              reasons?.length > 0 ?
                <Select
                  onChange={(e) => setReasonSubmit(e.target.value)}
                  w='70%' placeholder='Please select a reason'
                >
                  {
                    reasons?.map((reason, i) =>
                      <option key={i} value={reason.reasonName}>{reason.reasonName}</option>
                    )
                  }
                </Select>
                : 'loading'
            }
          </VStack>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size='sm' mt={7}>
            <Button
              onClick={submitHandler}
              disabled={!reasonSubmit || isLoading}
              isLoading={isLoading}
              colorScheme='blue'
            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              isLoading={isLoading}
              colorScheme='red'
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}



//Print Preview - For approved MO

// export const PrintModal = ({ isOpen, onClose, closeApprove }) => {

//   const closeHandler = () => {
//     onClose()
//     closeApprove()
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
//       <ModalContent>
//         <ModalHeader>
//           <Flex justifyContent='center'>
//             <Text>Print Preview</Text>
//             <Text>Do you want to print this slip?</Text>
//           </Flex>
//         </ModalHeader>
//         <ModalCloseButton onClick={closeHandler} />

//         <ModalBody>
//           <VStack justifyContent='center'>
//             <Text>Print Context here</Text>
//           </VStack>
//         </ModalBody>

//         <ModalFooter>
//           <ButtonGroup size='sm' mt={7}>
//             <Button
//               colorScheme='blue'
//             // onClick={submitHandler}
//             >
//               Yes
//             </Button>
//             <Button colorScheme='red' onClick={closeHandler}>No</Button>
//           </ButtonGroup>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   )

// }