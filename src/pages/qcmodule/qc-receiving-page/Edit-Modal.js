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
import { GoCheck } from 'react-icons/go'
import { ImCross } from 'react-icons/im'
import { BsSlashLg } from 'react-icons/bs'
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

  const [manufacturingDate, setManufacturingDate] = useState(new Date())
  const [expectedDelivery, setExpectedDelivery] = useState(null)
  const [expiryDate, setExpiryDate] = useState(new Date())
  const [actualDelivered, setActualDelivered] = useState(null)
  const [batchNo, setBatchNo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)
  const [startDate, setStartDate] = useState(new Date())
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

  // const manufacturingDateProvider = (data) => {
  //   setManufacturingDate(data)
  // }

  // const expiryDateProvider = (data) => {
  //   setExpiryDate(data)
  // }

  const expectedDeliveryProvider = (data) => {
    setExpectedDelivery(data)
  }

  const actualDeliveredProvider = (data) => {
    setActualDelivered(data)
  }

  const batchNoProvider = (data) => {
    setBatchNo(data)
  }

  const submitEditedHandlder = () => {
    let submitData = {
      pO_Summary_Id: editData.id,
      manufacturing_Date: moment(manufacturingDate).format("YYYY-MM-DD"),
      expected_Delivery: Number(expectedDelivery),
      expiry_Date: moment(expiryDate).format("YYYY-MM-DD"),
      actual_Delivered: Number(actualDelivered),
      batch_No: Number(batchNo),
    }
    console.log(submitData)
    try {
      setIsLoading(true)
      const res = apiClient.put(`Receiving/ReceiveRawMaterialsById/${editData.id}`, submitData
      ).then((res) => {
        ToastComponent("Success!", "Edited", "success", toast)
        setIsLoading(false)
        fetchPo()
      }
      ).catch(err => {
        setIsLoading(false)
        ToastComponent("Error", err.response.data, "error", toast)
      }
      )
    } catch (err) {
      console.log(err)
    }
  }

  return (

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
                      {/* <Input
                      {...register("submitData.manufacturing_date")}
                      placeholder='YYYY-MM-DD'
                      bgColor='#ffffe0'
                    /> */}
                    </FormLabel>
                    <DatePicker
                      className='chakra-input css-7s3glp'
                      selected={manufacturingDate}
                      onChange={(date) => setManufacturingDate(date)}
                      shouldCloseOnSelect={true}
                    />
                  </VStack>

                  <VStack spacing={-1.5} w='40%' mr={3}>
                    <FormLabel w='96%'>
                      Expiry Date
                      {/* <Input
                      {...register("submitData.manufacturing_date")}
                      placeholder='YYYY-MM-DD'
                      bgColor='#ffffe0'
                    /> */}
                    </FormLabel>
                    <DatePicker
                      className='chakra-input css-7s3glp'
                      selected={expiryDate}
                      onChange={(date) => setExpiryDate(date)}
                      shouldCloseOnSelect={true}
                    />
                  </VStack>
                </Flex>

                <Flex justifyContent='space-between'>
                  <FormLabel w='40%'>
                    Expected Delivery
                    <Input
                      {...register("submitData.expected_delivery")}
                      onChange={(e) => expectedDeliveryProvider(e.target.value)}
                      placeholder='Please provide quantity of expected delivery'
                      bgColor='#ffffe0'
                      type='number'
                    />
                  </FormLabel>

                  <FormLabel w='40%'>
                    Qty. Actual Delivered
                    <Input
                      {...register("submitData.actual_delivered")}
                      onChange={(e) => actualDeliveredProvider(e.target.value)}
                      placeholder='Please enter quantity'
                      bgColor='#ffffe0'
                      type='number'
                    />
                  </FormLabel>
                </Flex>

                <Flex justifyContent='space-between'>
                  <FormLabel w='40%'>
                    No. Qty. Actual Good Needed
                    <Input
                      {...register("displayData.actualGood")}
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
                      placeholder='Please provide batch number'
                      bgColor='#ffffe0'
                      type='number'
                    />
                    <Text color="danger" fontSize="xs">{errors.submitData?.batch_no?.message}</Text>
                  </FormLabel>
                </Flex>

                {/* REJECTION INFORMATION */}

                <Flex justifyContent='center' mb={2} p={1} color='white' bgColor='secondary'>
                  <Text>REJECTION INFORMATION</Text>
                </Flex>

                <Flex justifyContent='space-between'>
                  <FormLabel w='40%'>
                    Quantity
                    <Input
                      placeholder='Editable'
                      bgColor='#ffffe0'
                    />
                  </FormLabel>

                  <FormLabel w='40%'>
                    Remarks
                    <Input
                      placeholder='Editable Dropdown'
                      bgColor='#ffffe0'
                    />
                  </FormLabel>
                </Flex>

                <Flex justifyContent='space-between'>
                  <FormLabel w='40%'>
                    Total Quantity
                    <Input
                      placeholder=''
                    />
                  </FormLabel>
                </Flex>
              </Stack>

              <Flex borderColor='secondary' borderX='none' borderBottom='none' borderWidth='5px' mb={10} mt={5}></Flex>
              <Text fontWeight='hairline' textAlign='center'>Upon arrival of the vehicle of medication/material at unloading area inspect the following:</Text>


              {/* Checklist  */}

              <Stack spacing={2} mt={3} mb={6}>

                {/* TRUCK INSPECTION */}

                <Box>
                  <Flex justifyContent='space-between' color='white' bgColor='secondary'>
                    <Text ml={2}>TRUCK INSPECTION</Text>
                    <Flex>
                      <HStack spacing={4}>
                        <GoCheck fontSize='20px' /> <BsSlashLg fontSize='17px' />
                        <ImCross fontSize='12px' />
                      </HStack>
                      <Text ml='230px' mr='70px'>Remarks</Text>
                    </Flex>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>The trucks are covered and closed</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="tc1" name="truck-inspection1" />
                        <label htmlFor="tc1"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="tx1" name="truck-inspection1" />
                        <label htmlFor="tc2"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>Floorboards are dry and clean</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="tc2" name="truck-inspection2" />
                        <label htmlFor="tc2"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="tx2" name="truck-inspection2" />
                        <label htmlFor="tx2"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>No evidence of chemical pills, garbage, waste or spoiled foods</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="tc3" name="truck-inspection3" />
                        <label htmlFor="tc3"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="tx3" name="truck-inspection3" />
                        <label htmlFor="tx3"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>No insect and rodent activity</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="tc4" name="truck-inspection4" />
                        <label htmlFor="tc2"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="tx4" name="truck-inspection4" />
                        <label htmlFor="tx4"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>
                </Box>

                {/* UNLOADING OF RAW MATERIALS */}

                <Box>
                  <Flex justifyContent='space-between' color='white' bgColor='secondary'>
                    <Text ml={2}>UNLOADING OF RAW MATERIALS</Text>
                    <Flex>
                      <HStack spacing={4}>
                        <GoCheck fontSize='20px' /> <BsSlashLg fontSize='17px' />
                        <ImCross fontSize='12px' />
                      </HStack>
                      <Text ml='230px' mr='70px'>Remarks</Text>
                    </Flex>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>All products are on clean pallets (if applicable)</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="uorwc1" name="unloading-of-raw-materials1" />
                        <label htmlFor="uorwc1"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="uorwx1" name="unloading-of-raw-materials1" />
                        <label htmlFor="uorwx1"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>No damage packaging</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="uorwc2" name="unloading-of-raw-materials2" />
                        <label htmlFor="uorwc2"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="uorwx2" name="unloading-of-raw-materials2" />
                        <label htmlFor="uorwx2"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>All packing are clean</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="uorwc3" name="unloading-of-raw-materials3" />
                        <label htmlFor="uorwc3"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="uorwx3" name="unloading-of-raw-materials3" />
                        <label htmlFor="uorwx3"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>Batch number, manufacturing date and expiry date are same as written in the Certificate of Analysis (COA) provided by supplier</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="uorwc4" name="unloading-of-raw-materials4" />
                        <label htmlFor="uorwc4"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="uorwx4" name="unloading-of-raw-materials4" />
                        <label htmlFor="uorwx4"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>
                </Box>

                {/* CHECKING OF PHYSICAL APPEARANCE/SAMPLING */}

                <Box>
                  <Flex justifyContent='space-between' color='white' bgColor='secondary'>
                    <Text ml={2}>CHECKING OF PHYSICAL APPEARANCE/SAMPLING</Text>
                    <Flex>
                      <HStack spacing={4}>
                        <GoCheck fontSize='20px' /> <BsSlashLg fontSize='17px' />
                        <ImCross fontSize='12px' />
                      </HStack>
                      <Text ml='230px' mr='70px'>Remarks</Text>
                    </Flex>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>The delivered raw materials has the same color/appearance</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="cc1" name="check-of-physical-appeareance/sampling1" />
                        <label htmlFor="cc1"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="cx1" name="check-of-physical-appeareance/sampling1" />
                        <label htmlFor="cx1"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>No foreign materials in the packaging and in the content of raw material</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="cc2" name="check-of-physical-appeareance/sampling2" />
                        <label htmlFor="cc2"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="cx2" name="check-of-physical-appeareance/sampling2" />
                        <label htmlFor="cx2"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>

                </Box>

                {/* QA CHECKLIST APPROVAL */}

                <Box>
                  <Flex justifyContent='space-between' color='white' bgColor='secondary'>
                    <Text ml={2}>QA CHECKLIST APPROVAL</Text>
                    <Flex>
                      <HStack spacing={4}>
                        <GoCheck fontSize='20px' /> <BsSlashLg fontSize='17px' />
                        <ImCross fontSize='12px' />
                      </HStack>
                      <Text ml='230px' mr='70px'>Remarks</Text>
                    </Flex>
                  </Flex>

                  <Flex justifyContent='space-between' mt={2}>
                    <Text w='40%'>The item selected, If approved in our QA basic mark as approved or else reject</Text>
                    <HStack mr={2}>
                      <HStack mr='127.5px'>
                        <input type="radio" id="qc1" name="qa-checklist-approval1" />
                        <label htmlFor="qc1"><GoCheck fontSize='20px' /></label>
                        <input type="radio" id="qx1" name="qa-checklist-approval1" />
                        <label htmlFor="qx1"><ImCross fontSize='12px' /></label>
                      </HStack>
                      <Input
                        placeholder='Hi'
                      />
                    </HStack>
                  </Flex>
                </Box>

              </Stack>
            </PageScrollQCModal>

          </ModalBody>
          <Flex borderColor='gray.100' borderWidth='5px' borderX='none' borderTop='none'></Flex>
          <ModalFooter>
            <Button
              onClick={() => submitEditedHandlder()}
              disabled={manufacturingDate && expectedDelivery && expiryDate && actualDelivered && batchNo ? false : true}
              variant='outline'
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex >
  )

}
