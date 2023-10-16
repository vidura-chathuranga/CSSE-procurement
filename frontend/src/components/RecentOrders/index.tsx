import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  Box,
  Badge,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons";
import { showNotification, updateNotification } from "@mantine/notifications";
import ManagerAPI from "../../api/ManagerAPI";
import { IconCheck } from "@tabler/icons";

//Interface for order data - (Raw data)
interface RowData {
  id: string;
  product: string;
  quantity: string;
  deliveryDate: string;
  site: string;
  status: string;
  specialNotes: string;
  updatedBy: string;
}

//Interface for manager data - (Raw data)
interface RowDataManagers {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
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

//Get all order records from the database
const getAllOrders = async () => {
    const response = await ManagerAPI.getOrders();
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
  
//Get all manager records from the database
const getAllManagers = async () => {
    const response = await ManagerAPI.getManagers();
    const data = await response.data;
    return data;
};

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

//Interface for Table header props
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
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
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
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
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const ManageOrders: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [managers, setManagers] = useState<RowDataManagers[]>([]);
  const [sites, setSites] = useState<RowDataSites[]>([]);
  const [products, setProducts] = useState<RowDataProducts[]>([]);


  // fetch order data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "order data is loading..",
        autoClose: false,
        disallowClose: true,
      });

      const result = await getAllOrders();
      const data = result.map((item: any) => {
        return {
            id: item._id,
            product: item.product,
            quantity: item.quantity,
            deliveryDate: item.deliveryDate,
            site: item.site,
            status: item.status,
            specialNotes: item.specialNotes,
            updatedBy: item.updatedBy,
        };
      });
      //limit the number of records to 10
      setData(data.slice(0, 10))

      const resultManagers = await getAllManagers();
      const managers = resultManagers.map((item: any) => {
        return {
            id: item._id,
            name: item.name,
        };
      });
      setManagers(managers);

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
    fetchData();
  }, []);

  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);


  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search: "" }));
  };

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{products.find((product) => product.value === row.product)?.label}</td>
      <td>{row.quantity}</td>
      <td>{row.deliveryDate.slice(0, 10)}</td>
      <td>{sites.find((site) => site.value === row.site)?.label}</td>
      <td>{
        row.status === "placed" ? (
            <Badge color="blue">Placed</Badge>
        ) : row.status === "confirmed" ? (
            <Badge color="green">Confirmed</Badge>
        ) : row.status === "dispatched" ? (
            <Badge color="yellow">Dispatched</Badge>
        ) : row.status === "delivered" ? (
            <Badge color="teal">Delivered</Badge>
        ) : (
            <Badge color="red">Rejected</Badge>
        )
        }
      </td>
      <td>{managers.find((manager) => manager.id === row.updatedBy)?.name}</td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ marginTop: "4%", width: "100%" }}>
        <Text size="xl" weight={700}>
                Recent Orders
        </Text>
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "auto", width: "100%" }}
          >
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "product"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("product")}
                >
                  Product
                </Th>
                <Th
                  sorted={sortBy === "quantity"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("quantity")}
                >
                  Quantity
                </Th>
                <Th
                  sorted={sortBy === "deliveryDate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("deliveryDate")}
                >
                  Delivery Date
                </Th>
                <Th
                  sorted={sortBy === "site"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("site")}
                >
                  Site
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  Status
                </Th>
                <Th
                  sorted={sortBy === "specialNotes"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("specialNotes")}
                >
                  Special Notes
                </Th>
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
    </Box>
  );
};

export default ManageOrders;
