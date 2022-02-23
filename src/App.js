import { Flex, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import { decodeUser } from './services/decode-user';
import { Context } from './context/Context';

import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage'

import InventoryPage from './pages/InventoryPage'
import MrpPage from './pages/inventory/MrpPage'
import MoveOrderPage from './pages/inventory/MoveOrderPage'
import TransactMoveOrderPage from './pages/inventory/TransactMoveOrderPage'
import MiscellaneousReceiptPage from './pages/inventory/MiscellaneousReceiptPage'
import MiscellaneousIssuePage from './pages/inventory/MiscellaneousIssuePage'

import QcModulePage from './pages/QcModulePage'
import QCReceivingPage from './pages/qcmodule/QCReceivingPage'
import WHReceivingPage from './pages/qcmodule/WHReceivingPage'
import RMNearlyExpirePage from './pages/qcmodule/RMNearlyExpirePage'
import ApprovalWHRejectionPage from './pages/qcmodule/ApprovalWHRejectionPage';
import CancelledRMPage from './pages/qcmodule/CancelledRMPage'

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
import ApprovalRequestPage from './pages/transformation/ApprovalRequestPage'
import PreparationPage from './pages/transformation/PreparationPage'
import MixingPage from './pages/transformation/MixingPage'

import ImportPage from './pages/ImportPage';
import ImportPoPage from './pages/import/ImportPoPage'
import ImportOrderPage from './pages/import/ImportOrderPage'
import ImportRawMaterialsPage from './pages/import/ImportRawMaterialsPage'
import ImportFormulationCodePage from './pages/import/ImportFormulationCodePage'

import UserManagementPage from './pages/UserManagementPage';
import UserAccountPage from './pages/usermanagement/UserAccountPage'
import UserRolePage from './pages/usermanagement/UserRolePage'
import ModuleManagementPage from './pages/usermanagement/ModuleManagementPage'
import DepartmentsPage from './pages/usermanagement/DepartmentsPage'

import SetupPage from './pages/SetupPage';
import UomManagementPage from './pages/setup/UomManagementPage'
import LotManagementPage from './pages/setup/LotManagementPage'
import RawMaterialsPage from './pages/setup/RawMaterialsPage'
import CustomerManagementPage from './pages/setup/CustomerManagementPage'
import SupplierPage from './pages/setup/SupplierPage'
import TransformationManagementPage from './pages/setup/TransformationManagementPage'
import ReasonPage from './pages/setup/ReasonPage'

import ReportsPage from './pages/ReportsPage';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState()

  const [isMobile] = useMediaQuery('(max-width: 1180px)')
  const user = decodeUser()

  useEffect(() => {
    setIsSidebarVisible(isMobile)
  }, [isMobile]);

  const SideBarHandler = () => {
    setIsSidebarVisible(prev => !prev)
  }

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
            <Route path="miscellaneous-issue" element={user ? <MiscellaneousIssuePage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="qc-module" element={user ? <QcModulePage /> : <Navigate to="/login" />}>
            <Route path="qc-receiving" element={user ? <QCReceivingPage /> : <Navigate to="/login" />} />
            <Route path="wh-receiving" element={user ? <WHReceivingPage /> : <Navigate to="/login" />} />
            <Route path="rm-nearly-expire" element={user ? <RMNearlyExpirePage /> : <Navigate to="/login" />} />
            <Route path="approval-wh-rejection" element={user ? <ApprovalWHRejectionPage /> : <Navigate to="/login" />} />
            <Route path="cancelled-rm" element={user ? <CancelledRMPage /> : <Navigate to="/login" />} />
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

          <Route path="transformation" element={user ? <TransformationPage /> : <Navigate to="/login" />}>
            <Route path="transformation-planning" element={user ? <TransformationPlanningPage /> : <Navigate to="/login" />} />
            <Route path="approval-request" element={user ? <ApprovalRequestPage /> : <Navigate to="/login" />} />
            <Route path="preparation" element={user ? <PreparationPage /> : <Navigate to="/login" />} />
            <Route path="mixing" element={user ? <MixingPage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="import" element={user ? <ImportPage /> : <Navigate to="/login" />}>
            <Route path="import-po" element={user ? <ImportPoPage /> : <Navigate to="/login" />} />
            <Route path="import-order" element={user ? <ImportOrderPage /> : <Navigate to="/login" />} />
            <Route path="import-raw-materials" element={user ? <ImportRawMaterialsPage /> : <Navigate to="/login" />} />
            <Route path="import-formulation-code" element={user ? <ImportFormulationCodePage /> : <Navigate to="/login" />} />
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
            <Route path="raw-materials-masterlisting" element={user ? <RawMaterialsPage /> : <Navigate to="/login" />} />
            <Route path="customer-management" element={user ? <CustomerManagementPage /> : <Navigate to="/login" />} />
            <Route path="supplier" element={user ? <SupplierPage /> : <Navigate to="/login" />} />
            <Route path="transformation-management" element={user ? <TransformationManagementPage /> : <Navigate to="/login" />} />
            <Route path="reason" element={user ? <ReasonPage /> : <Navigate to="/login" />} />
          </Route>

          <Route path="reports" element={user ? <ReportsPage /> : <Navigate to="/login" />}>

          </Route>
        </Route>
      </Routes >
    </Context.Provider>
  );
}

function Layout({ isSidebarVisible, sideBarHandler }) {


  return (

    <Flex bgColor='white' h='100vh'>

      {!isSidebarVisible && (

        <Sidebar />
      )}
      <Flex w='full' bgColor='gray.300' flexDirection='column'>
        <Header sideBarHandler={sideBarHandler} />

        <Flex bgColor='white' h='100%' >
          <Outlet />
        </Flex>
      </Flex>
    </Flex>

  );
}

export default App;
