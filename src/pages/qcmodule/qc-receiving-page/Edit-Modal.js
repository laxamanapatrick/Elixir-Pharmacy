import React, { useState } from 'react'
import {
  Flex,
  Input,
  Text,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { decodeUser } from '../../../services/decode-user'
import PageScrollQCModal from '../../../components/PageScrollQCModal'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ToastComponent } from '../../../components/Toast'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { EditModalComponentRejectionInfo } from './Edit-Modal-Rejection-Information'
import { EditModalChecklist } from './Edit-Modal-Checklist'
import { EditModalSubmit } from './Edit-Modal-Submit'
import { ReceivingContext } from '../../../context/ReceivingContext'

const currentUser = decodeUser()


export const EditModalComponent = ({ editData, isOpen, onClose, fetchPo, fetchNotification }) => {

  const [manufacturingDate, setManufacturingDate] = useState(null)
  const [expectedDelivery, setExpectedDelivery] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [actualDelivered, setActualDelivered] = useState(null)
  const [batchNo, setBatchNo] = useState(null)

  const [sumQuantity, setSumQuantity] = useState(0)
  const [receivingId, setReceivingId] = useState(null)

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [submitDataTwo, setSubmitDataTwo] = useState([])
  const [submitDataThree, setSubmitDataThree] = useState([])
  const toast = useToast()

  const { register } = useForm({
    resolver: yupResolver(),
    mode: "onChange",
    defaultValues: {
      submitData: {
        po_summary_id: editData.id,
        manufacturing_date: "",
        expected_delivery: "",
        expiry_date: "",
        actual_delivered: "",
        batch_no: "",
        addedBy: currentUser.fullName
      },
      displayData: {
        id: editData.id,
        pR_Number: editData.pR_Number,
        pR_Date: moment(editData.pR_Date).format("MM/DD/YYYY"),
        pO_Number: editData.pO_Number,
        pO_Date: moment(editData.pO_Date).format("MM/DD/YYYY"),
        itemCode: editData.itemCode,
        itemDescription: editData.itemDescription,
        supplier: editData.supplier,
        uom: editData.uom,
        quantityOrdered: editData.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        actualGood: editData.actualGood.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        actualRemaining: editData.actualRemaining.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
        checkingDate: moment().format("MM/DD/YYYY"),
      }
    }
  })

  const manufacturingDateProvider = (data) => {
    setManufacturingDate(data)
  }

  const expiryDateProvider = (data) => {
    const day1 = new Date()
    const day2 = new Date(data)
    const daysDifference = (day2.getTime() - day1.getTime()) / (1000 * 3600 * 24)
    if (daysDifference <= 30) {
      ToastComponent("Warning", "Item is about to expire", "warning", toast)
    }
    setExpiryDate(data)
  }

  const expectedDeliveryProvider = (data) => {
    setExpectedDelivery(data)
  }

  const actualDeliveredProvider = (data) => {
    const allowablePercent = editData.quantityOrdered * 0.1
    const allowableAmount = editData.actualRemaining + allowablePercent
    if (data > allowableAmount) {
      setActualDelivered("")
      ToastComponent("Warning!", "Amount is greater than allowable", "warning", toast)
    } else {
      setActualDelivered(data)
    }
  }

  const batchNoProvider = (data) => {
    setBatchNo(data)
  }

  let submitDataOne = {
    pO_Summary_Id: editData.id,
    itemCode: editData.itemCode,
    manufacturing_Date: moment(manufacturingDate).format("yyyy-MM-DD"),
    expected_Delivery: Number(expectedDelivery),
    expiry_Date: moment(expiryDate).format("yyyy-MM-DD"),
    actual_Delivered: Number(actualDelivered),
    batch_No: batchNo,
    totalReject: sumQuantity,
    qcBy: currentUser.fullName
  }

  const newDate = new Date()
  const maxDateManufacturing = moment(newDate).format('yyyy-MM-DD')
  const minDateExpiry = moment(newDate).format('yyyy-MM-DD')

  return (
    <ReceivingContext.Provider value={{ setSubmitDataTwo, setSubmitDataThree, setSumQuantity, setReceivingId }}>
      <Flex>
        <Modal size='6xl' isOpen={isOpen} onClose={() => { }} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent='center'>
                <Text>
                  Edit PO Summary
                </Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <Flex borderColor='gray.100' borderWidth='5px' borderX='none' borderTop='none'></Flex>
            <ModalBody>

              <PageScrollQCModal>
                <Stack spacing={5}>

                  {/* RAW MATERIALS INFORMATION */}

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
                        bgColor='gray.300'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      Description
                      <Input
                        {...register("displayData.itemDescription")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
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
                        bgColor='gray.300'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      Date of Checking
                      <Input
                        {...register("displayData.checkingDate")}
                        placeholder='Alapa Variable'
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
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
                        bgColor='gray.300'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      PO Date
                      <Input
                        {...register("displayData.pO_Date")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
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
                        bgColor='gray.300'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      PR Date
                      <Input
                        {...register("displayData.pR_Date")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
                      />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent='space-between'>
                    <FormLabel w='40%'>
                      Quantity Ordered
                      <Input
                        {...register("displayData.quantityOrdered")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      UOM
                      <Input
                        {...register("displayData.uom")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
                      />
                    </FormLabel>

                  </Flex>

                  <Flex justifyContent='space-between'>
                    <VStack spacing={-1.5} w='40%'>
                      <FormLabel w='96%'>
                        Manufacturing Date
                      </FormLabel>
                      <Input
                        onChange={(date) => manufacturingDateProvider(date.target.value)}
                        max={maxDateManufacturing}
                        type='date' bgColor='#fff8dc'
                      />
                    </VStack>

                    <VStack spacing={-1.5} w='40%' mr={3}>
                      <FormLabel w='96%'>
                        Expiry Date
                      </FormLabel>
                      <Input
                        onChange={(date) => expiryDateProvider(date.target.value)}
                        min={minDateExpiry}
                        type='date' bgColor='#fff8dc'
                      />
                    </VStack>
                  </Flex>

                  <Flex justifyContent='space-between'>
                    <FormLabel w='40%'>
                      Expected Delivery
                      <Input
                        {...register("submitData.expected_delivery")}
                        onChange={(e) => expectedDeliveryProvider(e.target.value)}
                        placeholder='Please provide quantity of expected delivery  (Required)'
                        bgColor='#ffffe0'
                        onWheel={(e) => e.target.blur()}
                        type='number'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      Qty. Actual Delivered
                      <Input
                        {...register("submitData.actual_delivered")}
                        onChange={(e) => actualDeliveredProvider(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        type='number'
                        placeholder='Please enter quantity (Required)'
                        bgColor='#ffffe0'
                      // pattern="^\d*(\.\d{0,2})?$"
                      />
                    </FormLabel>
                  </Flex>

                  <Flex justifyContent='space-between'>
                    <FormLabel w='40%'>
                      No. Qty. Actual Good Needed
                      <Input
                        {...register("displayData.actualRemaining")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                        bgColor='gray.300'
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      Batch NO.
                      <Input
                        {...register("submitData.batch_no")}
                        onChange={(e) => batchNoProvider(e.target.value)}
                        placeholder='Please provide batch number (Required)'
                        bgColor='#ffffe0' 
                        onWheel={(e) => e.target.blur()}
                        // type='number'
                      />
                    </FormLabel>
                  </Flex>

                  {/* REJECTION INFORMATION */}
                  <EditModalComponentRejectionInfo po_ReceivingId={submitDataOne.pO_Summary_Id} sumQuantity={sumQuantity} receivingId={receivingId} />

                </Stack>

                <Flex borderColor='secondary' borderX='none' borderBottom='none' borderWidth='5px' mb={10} mt={5}></Flex>
                <Text fontWeight='hairline' textAlign='center'>Upon arrival of the vehicle of medication/material at unloading area inspect the following:</Text>

                {/* Checklist  */}
                <EditModalChecklist
                  manufacturingDate={manufacturingDate}
                  expiryDate={expiryDate}
                  expectedDelivery={expectedDelivery}
                  actualDelivered={actualDelivered}
                  batchNo={batchNo}
                  setIsSubmitDisabled={setIsSubmitDisabled}
                />

              </PageScrollQCModal>

            </ModalBody>
            <Flex borderColor='gray.100' borderWidth='5px' borderX='none' borderTop='none'></Flex>
            <ModalFooter>

              {/* Submit */}
              <EditModalSubmit
                sumQuantity={sumQuantity}
                receivingId={receivingId}
                po_ReceivingId={submitDataOne.pO_Summary_Id}
                submitDataOne={submitDataOne}
                submitDataTwo={submitDataTwo}
                submitDataThree={submitDataThree}
                isSubmitDisabled={isSubmitDisabled}
                fetchPo={fetchPo}
                fetchNotification={fetchNotification}
                closeModal={onClose}
                manufacturingDate={manufacturingDate} expiryDate={expiryDate}
                expectedDelivery={expectedDelivery} actualDelivered={actualDelivered}
                batchNo={batchNo}
              />

            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex >
    </ReceivingContext.Provider>
  )

}
