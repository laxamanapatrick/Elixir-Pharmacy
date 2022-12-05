import {
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  ButtonGroup
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../../services/apiClient';
import PageScrollQCModal from '../../../components/PageScrollQCModal'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../../services/decode-user';
import { ToastComponent } from '../../../components/Toast';

const currentUser = decodeUser()

export const ModalComponent = ({ fetchWHReceiving, modalData, isOpen, onClose, fetchNotification }) => {

  const [reasons, setReasons] = useState([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitReason, setSubmitReason] = useState("")
  const [submitRemarks, setSubmitRemarks] = useState("")

  const toast = useToast()

  const { register } = useForm({
    resolver: yupResolver(),
    mode: "onChange",
    defaultValues: {
      displayData: {
        itemCode: modalData.itemCode,
        itemDescription: modalData.itemDescription,
        supplier: modalData.supplier,
        qC_ReceivedDate: modalData.qC_ReceivedDate,
        pO_Number: modalData.pO_Number,
        pO_Date: modalData.pO_Date,
        pR_Number: modalData.pR_Number,
        pR_Date: modalData.pR_Date,
        cancellationReason: "",
        quantityOrdered: modalData.actualGood,
        manufacturingDate: modalData.manufacturingDate,
        expirationDate: modalData.expirationDate,
        reject: modalData.reject,
        remarks: "",
        addedBy: currentUser.fullName
      }
    }
  })

  const fetchReasonsApi = async () => {
    const res = await apiClient.get('Reason/GetAllActiveReason')
    return res.data
  }

  const fetchReason = async () => {
    fetchReasonsApi().then(res => {
      setReasons(res)
    })
  }

  useEffect(() => {
    fetchReason()
  }, [setReasons])

  const reasonHandler = (data) => {
    setSubmitReason(data)
  }

  const remarksHandler = (data) => {
    setSubmitRemarks(data)
  }

  const submitHandler = () => {

    const submitData = {
      id: modalData.id,
      reason: submitReason,
      cancelRemarks: submitRemarks
    }

    try {
      setIsLoading(true)
      const res = apiClient.put(`Warehouse/CancelPartialReceivingInQc/${modalData.id}`, submitData)
        .then((res) => {
          ToastComponent("Success!", "Cancelled", "success", toast)
          fetchWHReceiving()
          fetchNotification()
          onClose(onClose)
        }).catch(err => {
          setIsLoading(false)
          ToastComponent("Error!", "Cancellation Failed", "error", toast)
        })
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <Modal isOpen={isOpen} onClose={() => { }} size='5xl' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack>
            <Text>
              Cancellation
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>

          <PageScrollQCModal>
            <Stack spacing={5}>

              {/* //Raw Mats Info */}

              <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                <Text>RAW MATERIALS INFORMATION</Text>
              </Flex>

              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  Item Code
                  <Input
                    {...register("displayData.itemCode")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

                <FormLabel w='40%'>
                  Description
                  <Input
                    {...register("displayData.itemDescription")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>
              </Flex>

              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  Supplier
                  <Input
                    {...register("displayData.supplier")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

                <FormLabel w='40%'>
                  Date of Checking
                  <Input
                    {...register("displayData.qC_ReceivedDate")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>
              </Flex>

              {/* RECEIVING INFORMATION */}

              <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                <Text>RECEIVING INFORMATION</Text>
              </Flex>

              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  PO NO.
                  <Input
                    {...register("displayData.pO_Number")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

                <FormLabel w='40%'>
                  PO Date
                  <Input
                    {...register("displayData.pO_Date")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>
              </Flex>

              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  PR NO.
                  <Input
                    {...register("displayData.pR_Number")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

                <FormLabel w='40%'>
                  PR Date
                  <Input
                    {...register("displayData.pR_Date")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>
              </Flex>

              {/* Input required */}
              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  Cancellation Reason
                  {
                    reasons.length > 0 ?
                      (<Select
                        onChange={(e) => reasonHandler(e.target.value)}
                        bgColor='#ffffe0'
                        placeholder='Select Reason'
                      >
                        {reasons?.map(reason =>
                          <option key={reason.id} value={reason.reasonName}>{reason.reasonName}</option>
                        )}
                      </Select>) : "Loading"
                  }
                </FormLabel>

                <FormLabel w='40%'>
                  Patrial Quantity
                  <Input
                    {...register("displayData.quantityOrdered")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

              </Flex>

              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  Manufacturing Date
                  <Input
                    {...register("displayData.manufacturingDate")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

                <FormLabel w='40%'>
                  Expiration Date
                  <Input
                    {...register("displayData.expirationDate")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>
              </Flex>

              <Flex justifyContent='space-between'>
                <FormLabel w='40%'>
                  Quantity Reject
                  <Input
                    {...register("displayData.reject")}
                    readOnly={true}
                    _disabled={{ color: 'black' }}
                    disabled={true}
                  />
                </FormLabel>

                {/* Input redquired */}
                <FormLabel w='40%'>
                  Remarks
                  <Input
                    onChange={(e) => remarksHandler(e.target.value)}
                    bgColor='#ffffe0'
                  />
                </FormLabel>
              </Flex>

            </Stack>
          </PageScrollQCModal>
        </ModalBody>

        <ModalFooter>

          <Popover
            placement='top-end'
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <Button
                disabled={!Boolean(submitReason && submitRemarks)}
                _hover={{ bgColor: 'accent', color: 'white' }}
                variant='outline'
                mr={3}
              >
                Submit
              </Button>
            </PopoverTrigger>
            <PopoverContent color='white' bg='secondary' borderColor='accent'>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                Are you sure you want to cancel?
              </PopoverBody>
              <PopoverFooter
                border='0'
                d='flex'
                alignItems='center'
                justifyContent='space-between'
                pb={4}
              >
                <ButtonGroup size='md'>
                  <Button
                    colorScheme='blue' _hover={{ bgColor: 'accent' }}
                    isLoading={isLoading}
                    onClick={() => submitHandler()}
                  >
                    Yes
                  </Button>
                  <Button
                    colorScheme='white'
                    _hover={{ bgColor: 'danger' }}
                    onClick={onClose}
                  >
                    No
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </Popover>

        </ModalFooter>
      </ModalContent>
    </Modal >
  )
}
