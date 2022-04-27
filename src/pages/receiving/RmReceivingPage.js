import React, { useState, useEffect } from 'react';
import {
  Flex,
  Input,
} from '@chakra-ui/react';
import ScannedModal from './rm-receiving-page/Scanned-Modal';
import apiClient from '../../services/apiClient';
import ScannedModalSubmit from './rm-receiving-page/Scanned-Modal-Submit';
import { SiCommonworkflowlanguage } from 'react-icons/si'
import ItemNotFound from './rm-receiving-page/Item-Not-Found';
import ProvideItemCode from './rm-receiving-page/Provide-Item-Code';
import { WarehouseContext } from '../../context/WarehouseContext'

const fetchItemCodeDataApi = async (code) => {
  const res = await apiClient.get(`Warehouse/ScanBarcode/${code}`)
  return res.data
}

const RmReceivingPage = () => {

  const [code, setCode] = useState("")
  const [itemCodeData, setItemCodeData] = useState([])

  const [receivingDate, setReceivingDate] = useState([])
  const [lotCategory, setLotCategory] = useState("")
  const [actualGood, setActualGood] = useState(0)

  const [quantity, setQuantity] = useState(0)
  const [remarks, setRemarks] = useState("")

  const [sumQuantity, setSumQuantity] = useState(0)

  const [submitRejectData, setSubmitRejectData] = useState([])

  const [receivingId, setReceivingId] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  // const { isOpen: isBarcodeScannerOpen, onOpen: openBarcodeScanner, onClose: closeBarcodeScanner } = useDisclosure()

  const fetchItemCodeData = () => {
    fetchItemCodeDataApi(code).then(res => {
      setIsLoading(false)
      setItemCodeData(res)
    })
  }

  useEffect(() => {
    fetchItemCodeData()

    return () => {
      setItemCodeData([])
    }
  }, [code])

  const itemHandler = (data) => {
    setCode(data)
  }

  // const openScanner = () => {
  //   openBarcodeScanner()
  // }

  return (
    <WarehouseContext.Provider value={{ setQuantity, setRemarks, setSumQuantity, setSubmitRejectData, setReceivingId }}>
      <Flex p={5} w='full' flexDirection='column'>

        <Flex mb={2} justifyContent='start'>
          <Flex>
            <Input
              placeholder='Item Code'
              onChange={(e) => itemHandler(e.target.value)}
            />
            {/* <SiCommonworkflowlanguage fontSize='40px' color='#33334C' />
            <Button
              onClick={() => openScanner()}
              bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }}>
              Scan
            </Button> */}
          </Flex>
        </Flex>

        {/* Data Display when Scanned or item Code provided */}

        {
          !code ? <ProvideItemCode /> :
            // isLoading ? (
            //   <Stack width="full">
            //     <Skeleton height='20px' />
            //     <Skeleton height='20px' />
            //     <Skeleton height='20px' />
            //     <Skeleton height='20px' />
            //     <Skeleton height='20px' />
            //     <Skeleton height='20px' />
            //   </Stack>
            // ) 
            // :
            code != itemCodeData.itemCode ? <ItemNotFound /> :
              <ScannedModal
                itemCodeData={itemCodeData}
                setReceivingDate={setReceivingDate}
                setLotCategory={setLotCategory}
                setActualGood={setActualGood}
                quantity={quantity}
                remarks={remarks}
                sumQuantity={sumQuantity}
                actualGood={actualGood}
                receivingId={receivingId}
              />
        }

        {/* Save Button */}

        {
          !(lotCategory && receivingDate) ? "" : (
            <ScannedModalSubmit
              code={code}
              receivingDate={receivingDate}
              lotCategory={lotCategory}
              actualGood={actualGood}
              sumQuantity={sumQuantity}
              submitRejectData={submitRejectData}
              fetchItemCodeData={fetchItemCodeData}
            />
          )
        }

        {/* Barcode Scanner */}

        {/* {
          isBarcodeScannerOpen && (
            <BarcodeScanner
              isOpen={openBarcodeScanner}
              onClose={closeBarcodeScanner}
              code={code}
            />
          )
        } */}

      </Flex >
    </WarehouseContext.Provider>
  )
};

export default RmReceivingPage;
