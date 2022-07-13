import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Table, Tbody, Td, Text, Th, Thead, toast, Tr, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'
import { PrintModal } from '../approvedmo/Action-Modals'

const currentUser = decodeUser()

export const ViewModal = ({ isOpen, onClose, id }) => {

  const [viewData, setViewData] = useState([])

  const fetchViewApi = async (id) => {
    const res = await apiClient.get(`Ordering/ViewMoveOrderForApproval?id=${id}`)
    return res.data
  }

  const fetchView = () => {
    fetchViewApi(id).then(res => {
      setViewData(res)
    })
  }

  useEffect(() => {
    if (id) {
      fetchView()
    }

    return () => {
      setViewData([])
    }
  }, [id])

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

export const ApproveModal = ({ isOpen, onClose, orderNo, fetchForApprovalMO, printData }) => {

  const toast = useToast()
  const { isOpen: isPrint, onClose: closePrint, onOpen: openPrint } = useDisclosure()

  const submitHandler = () => {
    try {
      const res = apiClient.put(`Ordering/ApproveListOfMoveOrder`, { orderNo: orderNo })
        .then(res => {
          ToastComponent("Success", "Move order has been approved", "success", toast)
          fetchForApprovalMO()
          openPrint()
        })
        .catch(jaypee => {
          ToastComponent("Error", "Move order was not approved", "error", toast)
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
                colorScheme='blue'
                onClick={submitHandler}
              >
                Yes
              </Button>
              <Button colorScheme='red' onClick={onClose}>No</Button>
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
          />
        )
      }
    </>
  )
}

export const RejectModal = ({ isOpen, onClose, id, fetchForApprovalMO }) => {

  const [reasonSubmit, setReasonSubmit] = useState('')

  const [reasons, setReasons] = useState([])

  const toast = useToast()

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
    console.log(id, reasonSubmit)
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
          fetchForApprovalMO()
          onClose()
        })
        .catch(err => {
          ToastComponent("Error", "Move order was not rejected", "error", toast)
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
              disabled={!reasonSubmit}
              colorScheme='blue'
            >
              Yes
            </Button>
            <Button colorScheme='red' onClick={onClose}>No</Button>
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