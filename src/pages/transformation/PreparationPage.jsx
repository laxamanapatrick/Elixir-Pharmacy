import React, { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  VStack
} from '@chakra-ui/react';
import { FormulaInformation } from './preparation/Formula-Information';
import { Requirements } from './preparation/Requirements';
import { ReceivingDetails } from './preparation/Receiving-Details';
import { RequirementsInformation } from './preparation/Requirements-Information';
import { SaveButton } from './preparation/Save-Button';
import apiClient from '../../services/apiClient';

const PreparationPage = () => {

  const [transformId, setTransformId] = useState(null)
  const [batch, setBatch] = useState(null)
  const [itemCode, setItemCode] = useState("")
  const [weight, setWeight] = useState('')

  const [information, setInformation] = useState([])
  const [requirements, setRequirements] = useState([])

  const [disableSave, setDisableSave] = useState(true)

  const fetchRequirementsApi = async () => {
    const res = await apiClient(`Preparation/GetAllRequirementsByTransformId?Id=${transformId}`)
    return res.data
  }

  const fetchRequirements = () => {
    fetchRequirementsApi(transformId).then(res => {
      setRequirements(res)
    })
  }

  useEffect(() => {
    if (transformId) {
      fetchRequirements()
    }

    return () => {
      setRequirements([])
    }
  }, [transformId])

  const fetchRequirementsInformationApi = async () => {
    const res = await apiClient(`Preparation/GetRawmaterialDetailsInWarehouse?id=${transformId}&code=${itemCode}`)
    return res.data
  }

  const fetchRequirementsInformation = () => {
    fetchRequirementsInformationApi(itemCode, transformId).then(res => {
      setInformation(res)
    })
  }

  useEffect(() => {
    if (itemCode) {
      fetchRequirementsInformation()
    }

    return () => {
      setInformation([])
    }
  }, [itemCode, transformId])

  return (
    <>
      <Flex p={5} w='full' h='auto' justifyContent='space-between'>
        <VStack border='1px' borderRight='0.5px' w='full'>
          <FormulaInformation
            setTransformId={setTransformId}
            setBatch={setBatch}
          />
          <Requirements
            requirements={requirements}
            setItemCode={setItemCode}
            itemCode={itemCode}
          />
        </VStack>
        <VStack border='1px' w='full' justifyContent='space-between'>
          <ReceivingDetails
            information={information}
            requirements={requirements}
          />
          <RequirementsInformation
            information={information}
            setWeight={setWeight}
            weight={weight}
            batch={batch}
            setDisableSave={setDisableSave}
          />
          <Flex w='90%' border='1px' />
          <SaveButton
            transformId={transformId}
            itemCode={itemCode}
            weight={weight}
            setItemCode={setItemCode}
            setWeight={setWeight}
            fetchRequirements={fetchRequirements}
            fetchRequirementsInformation={fetchRequirementsInformation}
            disableSave={disableSave}
          />
        </VStack>
      </Flex>
    </>
  )
}

export default PreparationPage;
