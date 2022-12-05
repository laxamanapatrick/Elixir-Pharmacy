import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, HStack, Input, Select, Skeleton, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import PageScrollImport from '../../components/PageScrollImport'
import * as XLSX from 'xlsx'
import apiClient from '../../services/apiClient'
import { ToastComponent } from '../../components/Toast'
import DateConverter from '../../components/DateConverter'
import moment from 'moment';
import { decodeUser } from '../../services/decode-user';

const currentUser = decodeUser()

const fetchUomApi = async () => {
  const res = await apiClient.get('Uom/GetAllActiveUOM');
  return res.data
}

const fetchItemCategoryApi = async () => {
  const res = await apiClient.get('RawMaterial/GetAllActiveItemCategories');
  return res.data
}

const ImportRawMaterialsPage = () => {

  const [uomData, setUomData] = useState([])
  const [itemCategoryData, setItemCategoryaAta] = useState([])
  const [workbook, setWorkbook] = useState([])
  const [excelData, setExcelData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [sheetOptions, setSheetOptions] = useState([])
  const toast = useToast()

  const fileClear = useRef()

  const fetchUom = () => {
    fetchUomApi().then(res => {
      setUomData(res)
    })
  }

  const fetchItemCategory = () => {
    fetchItemCategoryApi().then(res => {
      setItemCategoryaAta(res)
    })
  }

  useEffect(() => {
    fetchUom()
  }, []);

  useEffect(() => {
    fetchItemCategory()
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


    // (jsonData.item_code.length() && jsonData.item_description.length() && jsonData.item_category.length() && jsonData.uom.length() && jsonData.buffer_level.length())

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
      itemCode: item.item_code,
      itemDescription: item.item_description,
      uom: item.uom,
      itemCategory: item.item_category,
      bufferLevel: item.buffer_level
    }

  })


  const functionUOM = (UOM) => {
    const uomId = uomData?.find(item => item.uoM_Code === UOM)
    return uomId?.id
  }

  const functionItemCategory = (itemCategory) => {
    const itemCategoryId = itemCategoryData?.find(item => item.itemCategoryName === itemCategory)
    return itemCategoryId?.id
  }

  const submitFile = () => {
    if (resultArray.length > 0) {
      setisLoading(true)
      const submitData = resultArray.map(item => ({
        itemCode: item.itemCode.toString(),
        itemDescription: item.itemDescription,
        uomId: functionUOM(item.uom),
        itemCategoryId: functionItemCategory(item.itemCategory),
        bufferLevel: item.bufferLevel,
        addedBy: currentUser.fullName
      }))
      try {
        const res = apiClient.post('Import/AddNewRawMaterialManual',
          submitData
        ).then((res) => {
          ToastComponent("Success!", "Raw Materials Imported", "success", toast)
          setisLoading(false)
          setIsDisabled(true)
          fileClear.current.value = ""
          setExcelData([])
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
        })
      } catch (err) {
      }
    } else {
      ToastComponent("Error!", "No data provided, please check your import", "error", toast)
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
            {/* {
              !resultArray.bufferLevel ? (
                <Flex>
                  <Text>Some data are missing. Please import the correct xlsx file for raw materials</Text>
                </Flex>
              ) : ( */}
            <Table variant='striped' size="sm">
              <Thead bgColor='secondary'>
                <Tr>
                  <Th color='white'>Item Code</Th>
                  <Th color='white'>Item Description</Th>
                  <Th color='white'>UOM</Th>
                  <Th color='white'>Item Category</Th>
                  <Th color='white'>Buffer Level</Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) =>
                  <Tr key={i}>
                    <Td>{ed.itemCode ? ed.itemCode : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for raw materials is uploaded.</Text>}</Td>
                    <Td>{ed.itemDescription ? ed.itemDescription : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for raw materials is uploaded.</Text>}</Td>
                    <Td>{ed.uom ? ed.uom : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for raw materias . is uploaded.</Text>}</Td>
                    <Td>{ed.itemCategory ? ed.itemCategory : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for raw materials is uploaded.</Text>}</Td>
                    <Td>{ed.bufferLevel ? ed.bufferLevel : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for raw materials is uploaded.</Text>}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            {/* )
            } */}
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

export default ImportRawMaterialsPage;
