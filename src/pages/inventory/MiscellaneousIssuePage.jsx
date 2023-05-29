import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, HStack, VStack } from "@chakra-ui/react";
import { RawMaterialsInformation } from "./miscissue/Raw-Materials-Information";
import { ListofIssue } from "./miscissue/List-of-Issue";
import { ListofIssues } from "./miscissue/viewingMiscIssue/List-Issue";
import { ActionButton } from "./miscissue/Action-Button";
import apiClient from "../../services/apiClient";

const fetchCustomersApi = async () => {
  const res = await apiClient.get(`Customer/GetAllActiveCustomer`);
  return res.data;
};
const fetchRawMatsApi = async () => {
  const res = await apiClient.get(`RawMaterial/GetAllActiveRawMaterials`);
  return res.data;
};
const fetchExpiryDatesApi = async (itemCode) => {
  const res = await apiClient.get(
    `Miscellaneous/GetAllAvailableStocksForMIsssue?itemcode=${itemCode}`
  );
  return res.data;
};

const MiscellaneousIssuePage = ({
  miscData,
  fetchActiveMiscIssues,
  navigation,
  setNavigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const customerRef = useRef();
  const remarksRef = useRef();

  const [customers, setCustomers] = useState([]);
  const [rawMats, setRawMats] = useState([]);

  const [expiryDates, setExpiryDates] = useState([]);

  const [totalQuantity, setTotalQuantity] = useState("");
  const [customerData, setCustomerData] = useState({
    customerCode: "",
    customer: "",
  });

  const [warehouseId, setWarehouseId] = useState("");
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: "",
    itemDescription: "",
    uom: "",
    customer: "",
    expirationDate: "",
    quantity: "",
  });
  const [details, setDetails] = useState("");
  const [remarks, setRemarks] = useState("");
  const [transactionDate, setTransactionDate] = useState('')

  const itemCode = rawMatsInfo.itemCode;

  const [selectorId, setSelectorId] = useState("");

  //Customer Fetching
  const fetchCustomers = () => {
    fetchCustomersApi().then((res) => {
      setCustomers(res);
    });
  };

  useEffect(() => {
    fetchCustomers();

    return () => {
      setCustomers([]);
    };
  }, []);

  //Raw Mats Fetching
  const fetchRawMats = () => {
    fetchRawMatsApi().then((res) => {
      setRawMats(res);
    });
  };

  useEffect(() => {
    fetchRawMats();

    return () => {
      setRawMats([]);
    };
  }, []);

  //Expiry Dates
  const fetchExpiryDates = () => {
    fetchExpiryDatesApi(itemCode).then((res) => {
      setExpiryDates(res);
    });
  };

  useEffect(() => {
    fetchExpiryDates();

    return () => {
      setExpiryDates([]);
    };
  }, [itemCode, navigation]);

  //Refetch on change navigation
  useEffect(() => {
    if (navigation) {
      fetchCustomers();
      fetchRawMats();
      fetchExpiryDates();
    }
  }, [navigation]);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            bgColor={navigation === 1 ? "secondary" : ""}
            color={navigation === 1 ? "white" : ""}
            _hover={{ bgColor: "accent", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            onClick={() => setNavigation(1)}
          >
            Add Issue
          </Button>
          <Button
            bgColor={navigation === 2 ? "secondary" : ""}
            color={navigation === 2 ? "white" : ""}
            _hover={{ bgColor: "accent", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            onClick={() => setNavigation(2)}
          >
            View Issues
          </Button>
        </HStack>
      </Flex>

      <VStack
        w="full"
        p={5}
        spacing={10}
        border="1px"
        height={miscData?.length === 0 ? "87vh" : "auto"}
      >
        {navigation === 1 ? (
          <>
            <RawMaterialsInformation
              rawMatsInfo={rawMatsInfo}
              setRawMatsInfo={setRawMatsInfo}
              details={details}
              setDetails={setDetails}
              customers={customers}
              rawMats={rawMats}
              expiryDates={expiryDates}
              setSelectorId={setSelectorId}
              setCustomerData={setCustomerData}
              warehouseId={warehouseId}
              setWarehouseId={setWarehouseId}
              fetchActiveMiscIssues={fetchActiveMiscIssues}
              customerData={customerData}
              customerRef={customerRef}
              remarks={remarks}
              setRemarks={setRemarks}
              remarksRef={remarksRef}
              transactionDate={transactionDate} setTransactionDate={setTransactionDate}
            />
            {miscData?.length > 0 ? (
              <>
                <ListofIssue
                  selectorId={selectorId}
                  setSelectorId={setSelectorId}
                  setTotalQuantity={setTotalQuantity}
                  miscData={miscData}
                  fetchActiveMiscIssues={fetchActiveMiscIssues}
                  fetchExpiryDates={fetchExpiryDates}
                  remarks={remarks}
                />
              </>
            ) : (
              ""
            )}
            <ActionButton
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              totalQuantity={totalQuantity}
              setTotalQuantity={setTotalQuantity}
              customerData={customerData}
              details={details}
              selectorId={selectorId}
              setSelectorId={setSelectorId}
              miscData={miscData}
              fetchActiveMiscIssues={fetchActiveMiscIssues}
              customerRef={customerRef}
              setDetails={setDetails}
              setRawMatsInfo={setRawMatsInfo}
              //warehouse Id
              warehouseId={warehouseId}
              fetchExpiryDates={fetchExpiryDates}
              remarks={remarks}
              setRemarks={setRemarks}
              remarksRef={remarksRef}
              transactionDate={transactionDate}
            />
          </>
        ) : navigation === 2 ? (
          <>
            <ListofIssues />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default MiscellaneousIssuePage;
