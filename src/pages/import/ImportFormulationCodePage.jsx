import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import PageScrollImport from '../../components/PageScrollImport'
import * as XLSX from 'xlsx'
import apiClient from '../../services/apiClient'
import { ToastComponent } from '../../components/Toast'
import DateConverter from '../../components/DateConverter'
import moment from 'moment';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { decodeUser } from '../../services/decode-user';

const currentUser = decodeUser()

const fetchFormulaApi = async () => {
  const res = await apiClient.get('Transformation/GetAllActiveFormula');
  return res.data
}

const fetchRawMaterialsApi = async () => {
  const res = await apiClient.get('RawMaterial/GetAllActiveRawMaterials');
  return res.data
}

const ImportFormulationCodePage = () => {

  const [formulas, setFormulas] = useState([])
  const [rawMaterials, setRawMaterials] = useState([])
  const [workbook, setWorkbook] = useState([])
  const [excelData, setExcelData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [sheetOptions, setSheetOptions] = useState([])
  const toast = useToast()

  const fileClear = useRef()

  const fetchFormula = () => {
    fetchFormulaApi().then(res => {
      setFormulas(res)
    })
  }

  const fetchRawMaterials = () => {
    fetchRawMaterialsApi().then(res => {
      setRawMaterials(res)
    })
  }

  useEffect(() => {
    fetchFormula()
  }, []);

  useEffect(() => {
    fetchRawMaterials()
  }, []);

  const fileRenderer = (jsonData) => {
    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_")
        if (key !== newKey) {
          row[newKey] = row[key]
          delete row[key]
        }
      })
    })
    setExcelData(jsonData)
  }

  const fileHandler = async (e) => {
    const file = e[0]
    const data = await file.arrayBuffer()
    const workbook = XLSX.readFile(data)

    setWorkbook(workbook)
    setSheetOptions(workbook.SheetNames)

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet)

    fileRenderer(jsonData)
    if (e) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  const sheetNumberHandlder = (data = 0) => {
    const worksheet = workbook.Sheets[workbook.SheetNames[data]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    fileRenderer(jsonData)
    if (data) {
      setIsDisabled(false)
    }
  }

  const resultArray = excelData.map(item => {

    return {
      formulaCode: item.formula_code,
      formulaDescription: item.formula_description,
      version: item.version,
      itemCodeInitial: item.item_code,
      itemDescription: item.item_description,
      quantity: item.quantity
    }

  })

  // let formulaCodeIdProvider = formulas?.find(two => {

  //   return resultArray.some(one => {
  //     return one.formulaCode === two.itemCode
  //   })
  // })

  // const rawMaterialIdProvider = rawMaterials?.find(two => {

  //   return resultArray.some(one => {
  //     return one.itemCodeInitial === two.itemCode
  //   })
  // })


  // console.log(formulaCodeIdProvider)
  // console.log(rawMaterialIdProvider)
  // console.log(rawMaterials)
  // console.log(formulas)
  // console.log(resultArray)


  const submitFile = (resultArray) => {

    let hasError = false

    resultArray.forEach(item => {
      if (!formulas.some(check => check.itemCode === item.formulaCode && check.version === item.version)) {
        hasError = true
      }
    })

    if (hasError) {
      ToastComponent("Error!", "Version not available.", "error", toast)
      return
    }

    if (resultArray.length > 0) {

      try {
        setisLoading(true)
        const res = apiClient.post('Import/AddNewFormulaManual',
          resultArray.map(item => ({
            transformationFormulaId: formulas.find(data => data.itemCode === item.formulaCode && data.version === item.version).id,
            rawMaterialId: rawMaterials.find(data => data.itemCode === item.itemCodeInitial).id,
            quantity: item.quantity,
            formulaDescription: item.formulaDescription,
            itemDescription: item.itemDescription,
            version: item.version,
            addedBy: currentUser.fullName
          }))
        ).then((res) => {
          ToastComponent("Success!", "Raw Materials Imported", "success", toast)
          setisLoading(false)
          setIsDisabled(true)
          fileClear.current.value = ""
          setExcelData([])
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error!", err.response.data, "error", toast)
        })
      } catch (err) {
        console.log(err)
      }

    } else {
      ToastComponent("Error", "No data provided, please check your import", "error", toast)
    }

  }

  return (
    <Flex w='full'>

      <Flex
        h='780px'
        ml='2%'
        mt='2%'
        w='96%'
        bgColor='white'
        flexDirection='column'
        border='2px'
        borderWidth='5px'
        borderColor='secondary'
        justifyContent='space-between'
      >
        <Flex>

          <PageScrollImport>

            <Table variant='striped' size="sm">
              <Thead bgColor='secondary'>
                <Tr>
                  <Th color='white'>Formula Code</Th>
                  <Th color='white'>Formula Description</Th>
                  <Th color='white'>Version</Th>
                  <Th color='white'>Item Code</Th>
                  <Th color='white'>Item Description</Th>
                  <Th color='white'>Quantity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) =>
                  <Tr key={i}>
                    <Td>{ed.formulaCode ? ed.formulaCode : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for formulation code is uploaded.</Text>}</Td>
                    <Td>{ed.formulaDescription ? ed.formulaDescription : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for formulation code is uploaded.</Text>}</Td>
                    <Td>{ed.version ? ed.version : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for formulation code is uploaded.</Text>}</Td>
                    <Td>{ed.itemCodeInitial ? ed.itemCodeInitial : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for formulation code is uploaded.</Text>}</Td>
                    <Td>{ed.itemDescription ? ed.itemDescription : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for formulation code is uploaded.</Text>}</Td>
                    <Td>{ed.quantity ? ed.quantity : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for formulation code is uploaded.</Text>}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>

          </PageScrollImport>
        </Flex>

        <Box p={2} bgColor='secondary'>
          <Flex justifyContent='space-between'>

            <Flex w='50%' justifyContent='start'>

              <Input 
              ref={fileClear}
              ml={1} w='47%' type='file' p={1} mr={.2} bgColor='white' onChange={(e) => fileHandler(e.target.files)} />

              <Select
                onChange={(e) => sheetNumberHandlder(e.target.selectedIndex)}
                w='31%'
                ml={2}
                bgColor='white'
              >
                {sheetOptions?.map((sh, i) =>

                  (<option key={i}>{sh}</option>)
                )}
              </Select>

            </Flex>

            <HStack>
              <Button
                onClick={() => submitFile(resultArray)}
                type='submit'
                isLoading={isLoading}
                isDisabled={isDisabled}
                _hover={{ color: 'white', bgColor: 'accent' }}
              >
                Import
              </Button>
            </HStack>

          </Flex>
        </Box>

      </Flex>
    </Flex>
  )
};

export default ImportFormulationCodePage
