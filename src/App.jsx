import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure, useMediaQuery, useToast, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import { decodeUser } from './services/decode-user';
import { Context } from './context/Context';
import AppScroll from './components/AppScroll';
import apiClient from './services/apiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastComponent } from './components/Toast';

import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage'

import InventoryPage from './pages/InventoryPage'
import MrpPage from './pages/inventory/MrpPage'
import MoveOrderPage from './pages/inventory/MoveOrderPage'
import TransactMoveOrderPage from './pages/inventory/TransactMoveOrderPage'
import MiscellaneousReceiptPage from './pages/inventory/MiscellaneousReceiptPage'
import MiscellaneousIssuePage from './pages/inventory/MiscellaneousIssuePage'

import QcModulePage from './pages/QcModulePage'
import QCReceivingPage from './pages/qcmodule/RM-QCReceivingPage'
import RMWHReceivingPage from './pages/qcmodule/RM-WH-ReceivingPage'
import WHConfirmReject from './pages/qcmodule/WH-Receiving-ConfirmReject'
import RMNearlyExpirePage from './pages/qcmodule/RM-NearlyExpirePage'
import RejectRMWHReceiving from './pages/qcmodule/RejectRM-WH-Receiving';
import CancelledRMPage from './pages/qcmodule/Cancelled-RMPage'

import ReceivingPage from './pages/ReceivingPage';
import RmReceivingPage from './pages/receiving/RmReceivingPage';
import ReceivingList from './pages/receiving/ReceivingList';

import OrderingPage from './pages/OrderingPage';
import OrdersPage from './pages/ordering/OrdersPage'
import PreparationSchedulePage from './pages/ordering/PreparationSchedulePage'
import ApprovalPage from './pages/ordering/ApprovalPage'
import OrderSummaryPage from './pages/ordering/OrderSummaryPage'

import TransformationPage from './pages/TransformationPage';

import TransformationPlanningPage from './pages/transformation/TransformationPlanningPage'
import AddRequest from './pages/transformation/transformation-planning/Add-Request';
import StatusOfRequest from './pages/transformation/transformation-planning/Status-Of-Request';
import RequestReject from './pages/transformation/transformation-planning/Request-Reject';


import ApprovalRequestPage from './pages/transformation/ApprovalRequestPage'
import PreparationPage from './pages/transformation/PreparationPage'
import MixingPage from './pages/transformation/MixingPage'

import ImportPage from './pages/ImportPage';
import ImportPoPage from './pages/import/ImportPoPage'
import ImportOrderPage from './pages/import/ImportOrderPage'
import ImportRawMaterialsPage from './pages/import/ImportRawMaterialsPage'
import ImportFormulationCodePage from './pages/import/ImportFormulationCodePage'
import ImportSupplier from './pages/import/ImportSupplier'

import UserManagementPage from './pages/UserManagementPage';
import UserAccountPage from './pages/usermanagement/UserAccountPage'
import UserRolePage from './pages/usermanagement/UserRolePage'
import ModuleManagementPage from './pages/usermanagement/ModuleManagementPage'
import DepartmentsPage from './pages/usermanagement/DepartmentsPage'

import SetupPage from './pages/SetupPage';
import UomManagementPage from './pages/setup/UomManagementPage'
import LotManagementPage from './pages/setup/LotManagementPage'
import LotCategoryPage from './pages/setup/lotmanagement/LotCategoryPage';
import RawMaterialsPage from './pages/setup/RawMaterialsPage'
import ItemCategoryPage from './pages/setup/rawmaterials/ItemCategoryPage';
import CustomerManagementPage from './pages/setup/CustomerManagementPage'
import FarmPage from './pages/setup/customermanagement/FarmPage';
import SupplierPage from './pages/setup/SupplierPage'
import TransformationManagementPage from './pages/setup/TransformationManagementPage'
import ReasonPage from './pages/setup/ReasonPage'

import MoveOrderApproval from './pages/MoveOrderApproval';
import ForApprovalMO from './pages/moveorderapproval/For-ApprovalMO';
import ApprovedMO from './pages/moveorderapproval/Approved-MO';
import RejectedMO from './pages/moveorderapproval/Rejected-MO';

import ReportsPage from './pages/ReportsPage';
import Reports from './pages/reports/Reports';
import { RiFileWarningFill } from 'react-icons/ri';

const fetchNotificationApi = async () => {
  const res = await apiClient.get(`Receiving/GetNotification`)
  return res.data
}

function App() {

  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState()

  const [isMobile] = useMediaQuery('(max-width: 1180px)')
  const user = decodeUser()

  const [notification, setNotification] = useState([])

  const fetchNotification = () => {
    fetchNotificationApi().then(res => {
      setNotification(res)
    })
  }

  useEffect(() => {
    fetchNotification()

    return () => {
      setNotification([])
    }
  }, [])

  useEffect(() => {
    setIsSidebarVisible(isMobile)
  }, [isMobile]);

  const SideBarHandler = () => {
    setIsSidebarVisible(prev => !prev)
  }

  //Miscellaneous Issue Fetch and Cancel Feature
  const [miscData, setMiscData] = useState([])
  const [navigation, setNavigation] = useState('')
  //Get Added Misc Issues per Item
  const userId = user?.id
  const fetchActiveMiscIssuesApi = async (userId) => {
    const res = await apiClient.get(`Miscellaneous/GetAllActiveMiscellaneousIssueTransaction?empId=${userId}`)
    return res.data
  }
  //Misc Issue Data
  const fetchActiveMiscIssues = () => {
    fetchActiveMiscIssuesApi(userId).then(res => {
      setMiscData(res)
    })
  }
  useEffect(() => {
    fetchActiveMiscIssues()

    return () => {
      setMiscData([])
    }
  }, [userId])
  // Open modal to cancel all ID on table if re-routed without saving
  const { isOpen: isArrayCancel, onClose: closeArrayCancel, onOpen: openArrayCancel } = useDisclosure()
  const path = useLocation()
  const pathMiscIssue = "/inventory/miscellaneous-issue"
  useEffect(() => {
    if (path.pathname !== pathMiscIssue && miscData?.length > 0) {
      openArrayCancel()
    }
  }, [path.pathname !== pathMiscIssue])



  return (

    <Context.Provider value={{ selectedMenu, setSelectedMenu }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Layout sideBarHandler={SideBarHandler} isSidebarVisible={isSidebarVisible} />} >

          <Route path="inventory" element={user ? <InventoryPage /> : <Navigate to="/login" />}>
            <Route path="mrp" element={user ? <MrpPage /> : <Navigate to="/login" />} />
            <Route path="move-order" element={user ? <MoveOrderPage /> : <Navigate to="/login" />} />
            <Route path="transact-move-order" element={user ? <TransactMoveOrderPage /> : <Navigate to="/login" />} />
            <Route path="miscellaneous-receipt" element={user ? <MiscellaneousReceiptPage /> : <Navigate to="/login" />} />
            <Route path="miscellaneous-issue" element={user ?
              <MiscellaneousIssuePage miscData={miscData} fetchActiveMiscIssues={fetchActiveMiscIssues} navigation={navigation} setNavigation={setNavigation} />
              : <Navigate to="/login" />} />
          </Route>

          <Route path="qc-module" element={user ? <QcModulePage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />}>
            <Route path="qc-receiving" element={user ? <QCReceivingPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="wh-receiving" element={user ? <RMWHReceivingPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="wh-confirm-reject" element={user ? <WHConfirmReject notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="rm-nearly-expire" element={user ? <RMNearlyExpirePage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="approval-wh-rejection" element={user ? <RejectRMWHReceiving notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="cancelled-rm" element={user ? <CancelledRMPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
          </Route>

          <Route path="receiving" element={user ? <ReceivingPage /> : <Navigate to="/login" />}>
            <Route path="rm-receiving" element={user ? <RmReceivingPage /> : <Navigate to="/login" />} />
            <Route path="receiving-list" element={user ? <ReceivingList /> : <Navigate to="/login" />} />
          </Route>

          <Route path="ordering" element={user ? <OrderingPage /> : <Navigate to="/login" />}>
            <Route path="orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
            <Route path="preparation-schedule" element={user ? <PreparationSchedulePage /> : <Navigate to="/login" />} />
            <Route path="approval" element={user ? <ApprovalPage /> : <Navigate to="/login" />} />
            <Route path="order-summary" element={user ? <OrderSummaryPage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="transformation" element={user ? <TransformationPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />}>
            <Route path="transformation-planning" element={user ? <TransformationPlanningPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />}>
              <Route path="add-request" element={user ? <AddRequest notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
              <Route path="status-of-request" element={user ? <StatusOfRequest notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
              <Route path="request-reject" element={user ? <RequestReject notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            </Route>
            <Route path="approval-request" element={user ? <ApprovalRequestPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="preparation" element={user ? <PreparationPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="mixing" element={user ? <MixingPage notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
          </Route>

          <Route path="import" element={user ? <ImportPage /> : <Navigate to="/login" />}>
            <Route path="import-po" element={user ? <ImportPoPage /> : <Navigate to="/login" />} />
            <Route path="import-order" element={user ? <ImportOrderPage /> : <Navigate to="/login" />} />
            <Route path="import-raw-materials" element={user ? <ImportRawMaterialsPage /> : <Navigate to="/login" />} />
            <Route path="import-formulation-code" element={user ? <ImportFormulationCodePage /> : <Navigate to="/login" />} />
            <Route path="import-supplier" element={user ? <ImportSupplier /> : <Navigate to="/login" />} />
          </Route>

          <Route path="user-management" element={user ? <UserManagementPage /> : <Navigate to="/login" />}>
            <Route path="user-account" element={user ? <UserAccountPage /> : <Navigate to="/login" />} />
            <Route path="user-role" element={user ? <UserRolePage /> : <Navigate to="/login" />} />
            <Route path="module-management" element={user ? <ModuleManagementPage /> : <Navigate to="/login" />} />
            <Route path="departments" element={user ? <DepartmentsPage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="setup" element={user ? <SetupPage /> : <Navigate to="/login" />}>
            <Route path="uom-management" element={user ? <UomManagementPage /> : <Navigate to="/login" />} />
            <Route path="lot-management" element={user ? <LotManagementPage /> : <Navigate to="/login" />} />
            <Route path="lot-category" element={user ? <LotCategoryPage /> : <Navigate to="/login" />} />
            <Route path="raw-materials-masterlisting" element={user ? <RawMaterialsPage /> : <Navigate to="/login" />} />
            <Route path="item-category" element={user ? <ItemCategoryPage /> : <Navigate to="/login" />} />
            <Route path="customer-management" element={user ? <CustomerManagementPage /> : <Navigate to="/login" />} />
            <Route path="farms" element={user ? <FarmPage /> : <Navigate to="/login" />} />
            <Route path="supplier" element={user ? <SupplierPage /> : <Navigate to="/login" />} />
            <Route path="t-management" element={user ? <TransformationManagementPage /> : <Navigate to="/login" />} />
            <Route path="reason" element={user ? <ReasonPage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="move-order-approval" element={user ? <MoveOrderApproval notification={notification} fetchNotification={fetchNotification} /> : <Navigate to='/login' />}>
            <Route path="for-approval" element={user ? <ForApprovalMO notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="approved-mo" element={user ? <ApprovedMO notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
            <Route path="rejected-mo" element={user ? <RejectedMO notification={notification} fetchNotification={fetchNotification} /> : <Navigate to="/login" />} />
          </Route>

          <Route path="reports" element={user ? <ReportsPage /> : <Navigate to="/login" />}>
            <Route path="reports" element={user ? <Reports /> : <Navigate to="/login" />} />
          </Route>
        </Route>
      </Routes >

      {
        isArrayCancel && (
          <CancelArrayModalConfirmation
            isOpen={isArrayCancel}
            onClose={closeArrayCancel}
            miscData={miscData}
            fetchActiveMiscIssues={fetchActiveMiscIssues}
            setNavigation={setNavigation}
          />
        )
      }

    </Context.Provider>

  )
}

function Layout({ isSidebarVisible, sideBarHandler }) {

  return (
    <Flex bgColor='white' h='100vh'>

      {!isSidebarVisible && (

        <Sidebar />
      )}
      <AppScroll>
        <Flex w='full' bgColor='gray.300' flexDirection='column'>
          <Header sideBarHandler={sideBarHandler} />

          <Flex bgColor='white' h='100%' >
            <Outlet />
          </Flex>
        </Flex>
      </AppScroll>
    </Flex >
  );
}
export default App;

//Misc Issue Cancel Array
const CancelArrayModalConfirmation = ({ isOpen, onClose, miscData, fetchActiveMiscIssues, setNavigation }) => {

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const cancelArraySubmitHandler = () => {
    setIsLoading(true)
    try {
      const cancelArray = miscData?.map(item => {
        return {
          id: item.id
        }
      })
      const res = apiClient.put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, cancelArray)
        .then(res => {
          ToastComponent("Warning", "Items has been cancelled", "success", toast)
          fetchActiveMiscIssues()
          onClose()
        })
        .catch(err => {
          // ToastComponent("Error", "Item was not cancelled", "Error", toast)
        })
    } catch (error) {
    }
  }

  const noHandler = () => {
    setNavigation(1)
    navigate('/inventory/miscellaneous-issue')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
      <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
        <ModalHeader>
          <VStack justifyContent='center'>
            <RiFileWarningFill color='yellow' fontSize='50px' />
            <Text color='warning' textAlign='center' fontSize='lg'>[Warning]</Text>
            <Text color='warning' textAlign='center' fontSize='sm'>[Miscellaneous Issue]</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={noHandler} />

        <ModalBody mb={5}>
          <VStack spacing={0}>
            <Text textAlign='center' fontSize='lg'>Your created lists will be cancelled.</Text>
            <Text textAlign='center' fontSize='sm'>Are you sure you want to leave this page?</Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={cancelArraySubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
            <Button onClick={noHandler} isLoading={isLoading} colorScheme='red'>No</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )

}
