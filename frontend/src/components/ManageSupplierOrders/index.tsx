import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Box,
  ActionIcon,
  Tooltip,
  Badge,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconCheck,
  IconX,
} from "@tabler/icons";
import { useState, useEffect } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { PurchaceOrderItems } from "../ManageOrders";
import ManagerAPI from "../../api/ManagerAPI";
import SupplierAPI from "../../api/SupplierAPI";

//Stylings
const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

//Interface for supplier data - (Raw data)
interface RowData {
  id: string;
  products: PurchaceOrderItems[];
  deliveryDate: string;
  site: string;
  status: string;
  specialNotes: string;
  updatedBy: string;
}

//Interface for Table header props
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

//Interface for site data - (Raw data)
interface RowDataSites {
  label: string;
  value: string;
}

//Interface for product data - (Raw data)
interface RowDataProducts {
  label: string;
  value: string;
}

//Create Table Headers
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

//Filter Data
function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
}

//Sort Data
function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (sortBy === "products") return 0;
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

//Get all order records from the database
const getApprovedOrders = async () => {
  const response = await SupplierAPI.getAcceptedOrders();
  const data = response.data;
  return data;
};

//Get all product records from the database
const getAllProducts = async () => {
  const response = await ManagerAPI.getProducts();
  const data = await response.data;
  return data;
};

//Get all sites records from the database
const getAllSites = async () => {
  const response = await ManagerAPI.getSites();
  const data = await response.data;
  return data;
};

// Supplier manage orders component
const ManageSupplierOrders = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(true);

  //holds site data state
  const [sites, setSites] = useState<RowDataSites[]>([]);

  //holds the product data
  const [products, setProducts] = useState<RowDataProducts[]>([]);

  // fetch order data
  useEffect(() => {
    // define fetchData function
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "order data is loading..",
        autoClose: false,
        disallowClose: true,
      });

      const result = await getApprovedOrders();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          products: item.products,
          deliveryDate: item.deliveryDate,
          site: item.site,
          status: item.status,
          specialNotes: item.specialNotes,
          updatedBy: item.updatedBy,
        };
      });
      setData(data);

      const resultSites = await getAllSites();
      const sites = resultSites.map((item: any) => {
        return {
          label: item.name,
          value: item._id,
        };
      });
      setSites(sites);

      const resultProducts = await getAllProducts();
      const products = resultProducts.map((item: any) => {
        return {
          label: item.name,
          value: item._id,
        };
      });
      setProducts(products);

      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };

      setSortedData(sortData(data, payload));
      setLoading(false);
      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage orders by adding, editing or deleting them.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };

    // call to fetchData function declared above, Then it will fetch all the data of the orders,managers,prodcuts and sites
    fetchData();
  }, []);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  // acceping the supplier pending order
  const orderAcceptedBySupplier = async (orderId: string) => {
    SupplierAPI.orderAcceptedBySupplier(orderId)
      .then((res) => {
        showNotification({
          id: "accept-order",
          color: "teal",
          title: "order accepted successfully",
          message: "You can view accepted orders in relevent tab",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });

        // chaning the status of the order status
        const result = data.map((item) => {
          if (item.id === orderId) {
            return {
              id: item.id,
              products: item.products,
              deliveryDate: item.deliveryDate,
              site: item.site,
              status: "SUP_APPROVED",
              specialNotes: item.specialNotes,
              updatedBy: item.updatedBy,
            };
          } else {
            return item;
          }
        });

        // re setting the new data
        setData(result);

        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };

        setSortedData(sortData(result, payload));
      })
      .catch((error) => {
        showNotification({
          id: "accept-order",
          color: "red",
          title: "Order was not accepted",
          message: "There was an error when accepting order",
          icon: <IconX size={16} />,
          autoClose: 3000,
        });
      });
  };

  // declined the order by supplier
  const orderDeclinedBySupplier = async (orderId: string) => {
    SupplierAPI.orderDeclinedBySupplier(orderId)
      .then((res) => {
        showNotification({
          id: "declined-order",
          color: "teal",
          title: "order declined successfully",
          message: "You can view declined orders in relevent tab",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });

        // chaning the status of the order status
        const result = data.map((item) => {
          if (item.id === orderId) {
            return {
              id: item.id,
              products: item.products,
              deliveryDate: item.deliveryDate,
              site: item.site,
              status: "SUP_APPROVED",
              specialNotes: item.specialNotes,
              updatedBy: item.updatedBy,
            };
          } else {
            return item;
          }
        });

        // re setting the new data
        setData(result);

        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };

        setSortedData(sortData(result, payload));
      })
      .catch((error) => {
        showNotification({
          id: "accept-order",
          color: "red",
          title: "Order was not declined",
          message: "There was an error when accepting order",
          icon: <IconX size={16} />,
          autoClose: 3000,
        });
      });
  };

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id.slice(0, 8).toUpperCase()}</td>
      <td>{sites.find((site) => site.value === row.site)?.label}</td>
      <td>{row.deliveryDate.slice(0, 10)}</td>
      <td>
        {row.products?.map((item) => (
          <div key={item.product}>
            {products.find((product) => product.value === item.product)?.label}{" "}
            - {item.quantity}
          </div>
        ))}
      </td>
      <td>{row.specialNotes}</td>
      <td>
        {
          <Badge
            color={
              row.status === "APPROVED"
                ? "yellow"
                : row.status === "SUP_APPROVED"
                ? "teal"
                : row.status === "SUP_DECLINED"
                ? "red"
                : "blue"
            }
          >
            {row.status === "APPROVED"
              ? "PENDING"
              : row.status === "SUP_APPROVED"
              ? "APPROVED"
              : row.status === "SUP_DECLINED"
              ? "DECLINED"
              : row.status}
          </Badge>
        }
      </td>
      <td>
        <Tooltip
          label="Accept order"
          onClick={() => orderAcceptedBySupplier(row.id)}
        >
          <ActionIcon
            color="teal"
            disabled={
              row.status === "SUP_DECLINED" || row.status === "SUP_APPROVED"
                ? true
                : false
            }
          >
            <IconCheck />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          label="Decline order"
          position="bottom"
          onClick={() => orderDeclinedBySupplier(row.id)}
        >
          <ActionIcon
            color="red"
            disabled={
              row.status === "SUP_DECLINED" || row.status === "SUP_APPROVED"
                ? true
                : false
            }
          >
            <IconX />
          </ActionIcon>
        </Tooltip>
      </td>
    </tr>
  ));
  return (
    // component body
    <Box sx={{ margin: "20px", width: "100%" }}>
      <Box>
        {/* search bar */}
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          sx={{ width: "500px" }}
        />
      </Box>
      <ScrollArea>
        {/* supplier pending order table */}
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "auto", width: "100%" }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("id")}
              >
                ID
              </Th>
              <Th
                sorted={sortBy === "site"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("site")}
              >
                Site
              </Th>
              <Th
                sorted={sortBy === "deliveryDate"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("deliveryDate")}
              >
                Delivery Date
              </Th>
              <Th
                sorted={sortBy === "products"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("products")}
              >
                Products
              </Th>
              <th>Special note</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <Text weight={500} align="center">
                    Loading
                  </Text>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <Text weight={500} align="center">
                    No items found
                  </Text>
                </td>
              </tr>
            ) : (
              rows
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
};

export default ManageSupplierOrders;
