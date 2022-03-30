import React, { useState, useEffect } from 'react'
import {
  Flex,
  HStack,
  Input,
  Text,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  FormLabel,
  useToast,
  VStack,
} from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import { decodeUser } from '../../../services/decode-user'
import PageScrollQCModal from '../../../components/PageScrollQCModal'
import DateConverter from '../../../components/DateConverter'
import moment from 'moment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import { ToastComponent } from '../../../components/Toast'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../../../theme/styles/date-picker.css'
import { EditModalComponentRejectionInfo } from './Edit-Modal-Rejection-Information'
import { EditModalChecklist } from './Edit-Modal-Checklist'
import { EditModalSubmit } from './Edit-Modal-Submit'
import { ReceivingContext } from '../../../context/ReceivingContext'

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    // id: yup.string(),
    // pO_Number: yup.number().required(),
    // pR_Number: yup.number().required(),
    // pR_Date: yup.string().required("PR Date is required"),
    // pO_Date: yup.string().required("PO Date is required"),
    // itemCode: yup.string().required("Item Code is required"),
    // itemDescription: yup.string().required("Item Description is required"),
    // supplier: yup.string().required("Supplier is required"),
    // uom: yup.string().required("UOM is required"),
    // quantityOrdered: yup.string().required("Quantity Ordered is required"),
    // actualGood: yup.string().required("Actual Good is required"),
    // actualRemaining: yup.string().required("Actual Good Remaining is required"),
    po_summary_id: yup.number(),
    manufacturing_date: yup.string().required("Required field"),
    expected_delivery: yup.number().required().typeError("Must be a number"),
    expiry_date: yup.string().required("Required field"),
    actual_delivered: yup.number().required().typeError("Must be a number"),
    batch_no: yup.number().required().typeError("Must be a number")
  })
})

export const EditModalComponent = ({ editData, isOpen, onClose, fetchPo }) => {

  const [manufacturingDate, setManufacturingDate] = useState(null)
  const [expectedDelivery, setExpectedDelivery] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [actualDelivered, setActualDelivered] = useState(null)
  const [batchNo, setBatchNo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [submitDataTwo, setSubmitDataTwo] = useState([])
  const [submitDataThree, setSubmitDataThree] = useState([])
  const toast = useToast()

  const { register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      submitData: {
        po_summary_id: editData.id,
        manufacturing_date: "",
        expected_delivery: "",
        expiry_date: "",
        actual_delivered: "",
        batch_no: "",
        addedBy: currentUser.userName
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
        quantityOrdered: editData.quantityOrdered,
        actualGood: editData.actualGood,
        actualRemaining: editData.actualRemaining,
        checkingDate: moment().format("MM/DD/YYYY"),
      }
    }
  })

  const manufacturingDateProvider = (data) => {
    setManufacturingDate(data)
  }

  const expiryDateProvider = (data) => {
    setExpiryDate(data)
  }

  const expectedDeliveryProvider = (data) => {
    setExpectedDelivery(data)
  }

  const actualDeliveredProvider = (data) => {
    setActualDelivered(data)
  }

  const batchNoProvider = (data) => {
    if (data && manufacturingDate && expiryDate && expectedDelivery && actualDelivered) {
      setIsSubmitDisabled(false)
      setBatchNo(data)
    } else {
      setIsSubmitDisabled(true)
    }
  }

  let submitDataOne = {
    pO_Summary_Id: editData.id,
    manufacturing_Date: moment(manufacturingDate).format("YYYY-MM-DD"),
    expected_Delivery: Number(expectedDelivery),
    expiry_Date: moment(expiryDate).format("YYYY-MM-DD"),
    actual_Delivered: Number(actualDelivered),
    batch_No: Number(batchNo)
  }

  return (
    <ReceivingContext.Provider value={{ setSubmitDataTwo, setSubmitDataThree }}>
      <Flex>
        <Modal size='6xl' isOpen={isOpen} onClose={() => { }}>
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
                        {...register("displayData.checkingDate")}
                        placeholder='Alapa Variable'
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

                  <Flex justifyContent='space-between'>
                    <FormLabel w='40%'>
                      Quantity Ordered
                      <Input
                        {...register("displayData.quantityOrdered")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      UOM
                      <Input
                        {...register("displayData.uom")}
                        readOnly={true}
                        _disabled={{ color: 'black' }}
                        disabled={true}
                      />
                    </FormLabel>

                  </Flex>

                  <Flex justifyContent='space-between'>
                    <VStack spacing={-1.5} w='40%'>
                      <FormLabel w='96%'>
                        Manufacturing Date
                      </FormLabel>
                      <DatePicker
                        className='chakra-input css-7s3glp'
                        selected={manufacturingDate}
                        onChange={(date) => manufacturingDateProvider(date)}
                        shouldCloseOnSelect={true}
                      />
                      {/* {manufacturingDate ? "" : <Text color='danger' fontSize='sm'>Manufacturing Date is required</Text>} */}
                    </VStack>

                    <VStack spacing={-1.5} w='40%' mr={3}>
                      <FormLabel w='96%'>
                        Expiry Date
                      </FormLabel>
                      <DatePicker
                        className='chakra-input css-7s3glp'
                        selected={expiryDate}
                        onChange={(date) => expiryDateProvider(date)}
                        shouldCloseOnSelect={true}
                      />
                      {/* {expiryDate ? "" : <Text color='danger' fontSize='sm'>Expiry Date is required</Text>} */}
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
                        type='number'
                      />
                      {/* {expectedDelivery ? "" : <Text color='danger' fontSize='sm'>Expected delivery quantity is required</Text>} */}
                    </FormLabel>

                    <FormLabel w='40%'>
                      Qty. Actual Delivered
                      <Input
                        {...register("submitData.actual_delivered")}
                        onChange={(e) => actualDeliveredProvider(e.target.value)}
                        placeholder='Please enter quantity  (Required)'
                        bgColor='#ffffe0'
                        type='number'
                      />
                      {/* {actualDelivered ? "" : <Text color='danger' fontSize='sm'>Actual delivered quantity is required</Text>} */}
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
                      />
                    </FormLabel>

                    <FormLabel w='40%'>
                      Batch NO.
                      <Input
                        {...register("submitData.batch_no")}
                        onChange={(e) => batchNoProvider(e.target.value)}
                        placeholder='Please provide batch number (Required)'
                        bgColor='#ffffe0'
                        type='number'
                      />
                      {/* {batchNo ? "" : <Text color='danger' fontSize='sm'>Batch number is required</Text>} */}
                    </FormLabel>
                  </Flex>

                  {/* REJECTION INFORMATION */}
                  <EditModalComponentRejectionInfo po_ReceivingId={submitDataOne.pO_Summary_Id} />

                </Stack>

                <Flex borderColor='secondary' borderX='none' borderBottom='none' borderWidth='5px' mb={10} mt={5}></Flex>
                <Text fontWeight='hairline' textAlign='center'>Upon arrival of the vehicle of medication/material at unloading area inspect the following:</Text>

                {/* Checklist  */}
                <EditModalChecklist />

              </PageScrollQCModal>

            </ModalBody>
            <Flex borderColor='gray.100' borderWidth='5px' borderX='none' borderTop='none'></Flex>
            <ModalFooter>

              {/* Submit */}
              <EditModalSubmit
                po_ReceivingId={submitDataOne.pO_Summary_Id}
                submitDataOne={submitDataOne}
                submitDataTwo={submitDataTwo}
                submitDataThree={submitDataThree}
                isSubmitDisabled={isSubmitDisabled}
                fetchPo={fetchPo}
                closeModal={onClose}
              />

            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex >
    </ReceivingContext.Provider>
  )

}
